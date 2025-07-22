import axios from 'axios';
import { backend } from './api';
import { compiler } from './api';

export default async function fetchSubmittedCode(submissionId) {
  try {
    // 1. Get the submission object
    const submissionRes = await backend.get(
      `/submissions/${submissionId}`
    );
    const submission = submissionRes.data;
    const filePath = submission.filePath;

    if (!filePath) {
      throw new Error("No filePath found in submission.");
    }

    // 2. Fetch code from compiler server
    const codeRes = await compiler.get(
      `/code?path=${encodeURIComponent(filePath)}`
    );

    return codeRes.data.code || "// Submitted code not found.";
  } catch (err) {
    console.error("Failed to fetch submitted code:", err.message);
    return "// Failed to fetch submitted code.";
  }
}
