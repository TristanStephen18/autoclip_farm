import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import AuthPage from "./pages/auth/Auth";
import YouTubeExtractor from "./pages/trials/youtubevideoextractor";
import { Main } from "./pages/main";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={AuthPage} />
        <Route path="/yt" component={YouTubeExtractor} />        
        <Route path="/home" component={Main} />

        <Route>
          {() => <div className="p-6 text-center">404 – Page not found</div>}
        </Route>
      </Switch>
    </QueryClientProvider>
  );
}

// function QuerySample() {
//   const { isPending, data, isError, isSuccess } = useQuery({
//     queryKey: ["hello"],
//     queryFn: () =>
//       fetch("http://localhost:3000/hello").then((res) => res.json()),
//   });

//   if (isPending) {
//     return "Pending data fetching";
//   }

//   if (isError) {
//     return "Error fetching data";
//   }
//   if (isSuccess) {
//     return <div>{data.message}</div>;
//   }
// }
