import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";\n\n// Preload Chat chunk for performance
 
const Chat = dynamic(() => import(/* webpackPreload: true */ "@/components/Chat"), {
  ssr: false,
});
 
export default async function Page() {
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

