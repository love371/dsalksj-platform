// Controller handles logic for API requests

const getMessage = (req, res) => {

    // sending response back to frontend
    res.json({
        message: "Hello from backend API 🚀"
    });

};

module.exports = { getMessage };