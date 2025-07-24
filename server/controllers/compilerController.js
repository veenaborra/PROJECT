import axios from 'axios';

const COMPILER_URL = process.env.COMPILER_URL;
const INTERNAL_SECRET = process.env.INTERNAL_SECRET;

// /compiler/run
export const runCode = async (req, res) => {
  try {
    const response = await axios.post(`${COMPILER_URL}/run`, req.body, {
      headers: {
        'x-internal-token': INTERNAL_SECRET
      }
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.error('Run error:', err.message);
    res.status(err.response?.status || 500).json({
      error: 'Run failed',
      details: err.response?.data?.details || err.message,
    });
  }
};

// /compiler/ai-review
export const aiReview = async (req, res) => {
  try {
    const response = await axios.post(`${COMPILER_URL}/ai-review`, req.body, {
      headers: {
        'x-internal-token': INTERNAL_SECRET
      }
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.error('AI Review error:', err.message);
    res.status(err.response?.status || 500).json({
      error: 'AI review failed',
      details: err.response?.data || err.message,
    });
  }
};

// /compiler/code?path=relative/file/path.cpp
export const getCode = async (req, res) => {
  try {
    const response = await axios.get(`${COMPILER_URL}/code`, {
      headers: {
        'x-internal-token': INTERNAL_SECRET
      },
      params: req.query
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.error('Get Code error:', err.message);
    res.status(err.response?.status || 500).json({
      error: 'Fetching code failed',
      details: err.response?.data || err.message,
    });
  }
};
