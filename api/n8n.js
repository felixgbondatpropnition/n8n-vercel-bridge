const axios = require('axios');

module.exports = async (req, res) => {
  // Enhanced CORS headers for Claude access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Your n8n credentials
  const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwM2ZmY2JlYS03NzJhLTRkMDktOWRjNS0wYzMxNWE3MTc0ZTIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MDM3NDcyfQ.RqYzXr-Ac5sHuieMfUGd9AYkGT4M63aWxGleKLIFxVY';
  const N8N_HOST = 'https://leadgeneration.app.n8n.cloud';
  
  const { action, data } = req.body || req.query || {};
  
  try {
    // List all workflows
    if (action === 'list_workflows') {
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
    
    // ACTIVATE workflow
    if (action === 'activate_workflow' && data?.id) {
      const response = await axios.patch(
        `${N8N_HOST}/api/v1/workflows/${data.id}`,
        { active: true },
        { headers: { 'X-N8N-API-KEY': N8N_API_KEY } }
      );
      return res.status(200).json({
        success: true,
        message: `Workflow ${data.id} activated`,
        workflow: response.data
      });
    }
    
    // DEACTIVATE workflow
    if (action === 'deactivate_workflow' && data?.id) {
      const response = await axios.patch(
        `${N8N_HOST}/api/v1/workflows/${data.id}`,
        { active: false },
        { headers: { 'X-N8N-API-KEY': N8N_API_KEY } }
      );
      return res.status(200).json({
        success: true,
        message: `Workflow ${data.id} deactivated`,
        workflow: response.data
      });
    }
    
    // CREATE new workflow
    if (action === 'create_workflow' && data?.workflow) {
      const response = await axios.post(
        `${N8N_HOST}/api/v1/workflows`,
        data.workflow,
        { headers: { 'X-N8N-API-KEY': N8N_API_KEY } }
      );
      return res.status(200).json({
        success: true,
        message: 'Workflow created',
        workflow: response.data
      });
    }
    
    // UPDATE workflow
    if (action === 'update_workflow' && data?.id && data?.updates) {
      const response = await axios.patch(
        `${N8N_HOST}/api/v1/workflows/${data.id}`,
        data.updates,
        { headers: { 'X-N8N-API-KEY': N8N_API_KEY } }
      );
      return res.status(200).json({
        success: true,
        message: `Workflow ${data.id} updated`,
        workflow: response.data
      });
    }
    
    // DELETE workflow
    if (action === 'delete_workflow' && data?.id) {
      await axios.delete(
        `${N8N_HOST}/api/v1/workflows/${data.id}`,
        { headers: { 'X-N8N-API-KEY': N8N_API_KEY } }
      );
      return res.status(200).json({
        success: true,
        message: `Workflow ${data.id} deleted`
      });
    }
    
    // EXECUTE workflow
    if (action === 'execute_workflow' && data?.id) {
      const response = await axios.post(
        `${N8N_HOST}/api/v1/workflows/${data.id}/execute`,
        data.body || {},
        { headers: { 'X-N8N-API-KEY': N8N_API_KEY } }
      );
      return res.status(200).json({
        success: true,
        execution: response.data
      });
    }
    
    // Get workflow executions
    if (action === 'get_executions' && data?.id) {
      const response = await axios.get(
        `${N8N_HOST}/api/v1/executions?workflowId=${data.id}`,
        { headers: { 'X-N8N-API-KEY': N8N_API_KEY } }
      );
      return res.status(200).json({
        success: true,
        executions: response.data
      });
    }
    
    // Find workflow by name (helper function)
    if (action === 'find_workflow_by_name' && data?.name) {
      const response = await axios.get(`${N8N_HOST}/api/v1/workflows`, {
        headers: { 'X-N8N-API-KEY': N8N_API_KEY }
      });
      
      const workflow = response.data.data.find(w => 
        w.name.toLowerCase() === data.name.toLowerCase()
      );
      
      if (workflow) {
        return res.status(200).json({
          success: true,
          workflow: workflow
        });
      } else {
        return res.status(404).json({
          success: false,
          error: `Workflow "${data.name}" not found`
        });
      }
    }
    
    // Activate workflow by name
    if (action === 'activate_workflow_by_name' && data?.name) {
      // First find the workflow
      const listResponse = await axios.get(`${N8N_HOST}/api/v1/workflows`, {
        headers: { 'X-N8N-API-KEY': N8N_API_KEY }
      });
      
      const workflow = listResponse.data.data.find(w => 
        w.name.toLowerCase() === data.name.toLowerCase()
      );
      
      if (!workflow) {
        return res.status(404).json({
          success: false,
          error: `Workflow "${data.name}" not found`
        });
      }
      
      // Then activate it
      const response = await axios.patch(
        `${N8N_HOST}/api/v1/workflows/${workflow.id}`,
        { active: true },
        { headers: { 'X-N8N-API-KEY': N8N_API_KEY } }
      );
      
      return res.status(200).json({
        success: true,
        message: `Workflow "${data.name}" (${workflow.id}) activated`,
        workflow: response.data
      });
    }
    
    // Default response with all available actions
    return res.status(200).json({
      success: true,
      message: 'n8n Bridge Ready - Full Control Enabled',
      available_actions: [
        'list_workflows',
        'get_workflow',
        'activate_workflow',
        'deactivate_workflow',
        'create_workflow',
        'update_workflow',
        'delete_workflow',
        'execute_workflow',
        'get_executions',
        'find_workflow_by_name',
        'activate_workflow_by_name'
      ],
      usage_examples: {
        activate: 'POST {action: "activate_workflow", data: {id: "workflow_id"}}',
        activate_by_name: 'POST {action: "activate_workflow_by_name", data: {name: "Cold Emails"}}',
        deactivate: 'POST {action: "deactivate_workflow", data: {id: "workflow_id"}}',
        execute: 'POST {action: "execute_workflow", data: {id: "workflow_id", body: {}}}'
      }
    });
    
  } catch (error) {
    console.error('Bridge error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || error.message,
      details: error.response?.data
    });
  }
};
