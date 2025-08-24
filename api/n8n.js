const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  // Your n8n credentials
  const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwM2ZmY2JlYS03NzJhLTRkMDktOWRjNS0wYzMxNWE3MTc0ZTIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MDM3NDcyfQ.RqYzXr-Ac5sHuieMfUGd9AYkGT4M63aWxGleKLIFxVY';
  const N8N_HOST = 'https://leadgeneration.app.n8n.cloud';
  
  const { method } = req;
  const { action, data } = req.body || {};
  
  try {
    // List workflows
    if (action === 'list_workflows' || req.query.action === 'list_workflows') {
      const response = await axios.get(`${N8N_HOST}/api/v1/workflows`, {
        headers: { 'X-N8N-API-KEY': N8N_API_KEY }
      });
      return res.status(200).json({
        success: true,
        workflows: response.data
      });
    }
    
    // Get specific workflow
    if (action === 'get_workflow' && data?.id) {
      const response = await axios.get(`${N8N_HOST}/api/v1/workflows/${data.id}`, {
        headers: { 'X-N8N-API-KEY': N8N_API_KEY }
      });
      return res.status(200).json({
        success: true,
        workflow: response.data
      });
    }
    
    // Execute workflow
    if (action === 'execute_workflow' && data?.id) {
      const response = await axios.post(
        `${N8N_HOST}/api/v1/workflows/${data.id}/execute`,
        data.body || {},
        { headers: { 'X-N8N-API-KEY': N8N_API_KEY } }
      );
      return res.status(200).json({
        success: true,
        result: response.data
      });
    }
    
    // Default response
    return res.status(200).json({
      success: true,
      message: 'n8n Bridge Ready',
      available_actions: ['list_workflows', 'get_workflow', 'execute_workflow'],
      usage: 'POST with {action: "list_workflows"} or use query param ?action=list_workflows'
    });
    
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.message
    });
  }
};
