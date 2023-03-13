import { useParams } from 'react-router-dom';

const User = () => {
  const { id } = useParams();
  return <>ユーザページ{id}</>;
};

export default User;
