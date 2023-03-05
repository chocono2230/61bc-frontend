import Config from './config';

const awsmobilemanual = {
  Auth: {
    region: 'ap-northeast-1',
    userPoolId: Config.userpoolId,
    userPoolWebClientId: Config.userpoolClientId,
  },
  API: {
    endpoints: [
      {
        name: 'api',
        endpoint: Config.apiEndpoint,
      },
    ],
  },
};

export default awsmobilemanual;
