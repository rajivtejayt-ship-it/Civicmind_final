import { db, handleFirestoreError, OperationType } from "./client";
import { collection, addDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { CivicIssue, IssueStatus } from "../../types/civic";

export async function createIssue(issue: CivicIssue): Promise<void> {
  try {
    // Strip 'id' field for document creation since Firestore generates it automatically
    const data = { ...issue };
    delete (data as { id?: string }).id;
    await addDoc(collection(db, "issues"), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, "issues");
  }
}

export async function getIssue(id: string): Promise<CivicIssue | null> {
  try {
    const docRef = doc(db, "issues", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
      } as CivicIssue;
    }
    return null;
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.GET,
      `issues/${id}`
    );
    return null;
  }
}

export async function getIssues(): Promise<CivicIssue[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "issues"));
    return querySnapshot.docs.map(
      (docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }) as CivicIssue
    );
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.LIST,
      "issues"
    );
    return [];
  }
}

export async function updateIssueStatus(
  issueId: string,
  status: IssueStatus
): Promise<void> {
  try {
    const docRef = doc(db, "issues", issueId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `issues/${issueId}`);
  }
}
