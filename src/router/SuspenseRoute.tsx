import { IRoutes } from "./routes";
import useUserRoles from "./useUserRoles";

export default function SuspenseRoute({
  app,
  component: Component,
  componentProps,
  role
}: IRoutes) {
  const roles = useUserRoles({ role });
  return <p>suspense route</p>;
}
//   const roles = useUserRoles({ role });

//   if (role && role.length > 0) {
//     return (
//       <GuardedRoute isAuth={roles.isAuth}>
//         <Suspense
//           fallback={
//             <App {...baseAppProps}>
//               <Loading />
//             </App>
//           }
//         >
//           <App {...app}>
//             <Component {...componentProps} />
//           </App>
//         </Suspense>
//       </GuardedRoute>
//     );
//   }

//   return (
//     <Suspense
//       fallback={
//         <App {...baseAppProps}>
//           <Loading />
//         </App>
//       }
//     >
//       <App {...app}>
//         <Component {...componentProps} />
//       </App>
//     </Suspense>
//   );
// }
