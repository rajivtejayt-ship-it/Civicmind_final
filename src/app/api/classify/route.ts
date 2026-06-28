import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY environment variable is not set.");
      return NextResponse.json(
        { error: "Internal Server Error: Missing Gemini API Key" },
        { status: 500 }
      );
    }

    const prompt = `You are a civic issue classifier.
Classify issue into one category:
- Infrastructure
- Safety
- Sanitation
- Mobility
- Environment
- Other

Determine severity:
- Low
- Medium
- High
- Critical

Provide confidence score:
- 0-100
Confidence MUST be an integer between 0 and 100.

Provide brief reasoning.

IMPORTANT
Return ONLY valid JSON.
Do not use markdown.
Do not wrap the response in \`\`\`json.
Do not provide explanations outside the JSON object.

You MUST choose exactly one category from:
Infrastructure
Safety
Sanitation
Mobility
Environment
Other
Any other category is invalid.

Severity MUST be exactly one of:
Low
Medium
High
Critical

Example:
{
  "category": "Infrastructure",
  "severity": "High",
  "confidence": 91,
  "reasoning": "Road damage affecting traffic safety."
}

Here is the civic issue to classify:
Title: ${title}
Description: ${description}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API call failed:", errorText);
      return NextResponse.json(
        { error: "Failed to communicate with Gemini API." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error("Empty response from Gemini API:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Empty classification response from Gemini." },
        { status: 500 }
      );
    }

    try {
      const classificationResult = JSON.parse(responseText.trim());

      if (
        !classificationResult.category ||
        !classificationResult.severity ||
        classificationResult.confidence === undefined ||
        !classificationResult.reasoning
      ) {
        return NextResponse.json(
          { error: "Incomplete Gemini response" },
          { status: 500 }
        );
      }

      const validCategories = [
        "Infrastructure",
        "Safety",
        "Sanitation",
        "Mobility",
        "Environment",
        "Other"
      ];

      const validSeverity = [
        "Low",
        "Medium",
        "High",
        "Critical"
      ];

      if (!validCategories.includes(classificationResult.category)) {
        return NextResponse.json(
          { error: "Invalid category returned by Gemini" },
          { status: 500 }
        );
      }

      if (!validSeverity.includes(classificationResult.severity)) {
        return NextResponse.json(
          { error: "Invalid severity returned by Gemini" },
          { status: 500 }
        );
      }

      if (
        typeof classificationResult.confidence !== "number" ||
        classificationResult.confidence < 0 ||
        classificationResult.confidence > 100
      ) {
        return NextResponse.json(
          { error: "Invalid confidence returned by Gemini" },
          { status: 500 }
        );
      }

      return NextResponse.json(classificationResult);
    } catch (error) {
      console.error("Failed to parse Gemini JSON", error);
      return NextResponse.json(
        { error: "Invalid Gemini response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in classification route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
