type _Config = {
  apiEndpoint: string;
  userpoolId: string;
  userpoolClientId: string;
};

const Config: _Config = {
  apiEndpoint: process.env.REACT_APP_API_ENDPOINT || '',
  userpoolId: process.env.REACT_APP_USERPOOL_ID || '',
  userpoolClientId: process.env.REACT_APP_USERPOOL_CLIENT_ID || '',
};

export default Config;
