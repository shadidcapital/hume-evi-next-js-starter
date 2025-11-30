import dynamic from 'next/dynamic';
import { getHumeAccessToken } from '@/utils/getHumeAccessToken';
import ErrorBoundary from '@/components/ErrorBoundary';

const Chat = dynamic(() => import('@/components/Chat'), {
  ssr: false,
});

export default async function ChatPage() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    throw new Error('Unable to get access token');
  }

  return (
    <div className={"grow flex flex-col"}>
      <ErrorBoundary fallback={<>Something went wrong loading chat.</>}>
        <Chat accessToken={accessToken} />
      </ErrorBoundary>
    </div>
  );
}
