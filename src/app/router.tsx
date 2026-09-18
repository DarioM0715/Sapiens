import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";

//COMPONENTS
import Layout from "@/components/Layout";
import AuthGuard from "@/context/AuthGuard";

// MAIN
const Home = lazy(() => import("@/components/Home/Home"));
const Community = lazy(() => import("@/components/Community/Community"));

// POST
const CreateArticle = lazy(() => import("@/components/Post/CreateArticle"));

//COMMENTBOX
const Commentbox = lazy(() => import("@/components/Commentbox/Commentbox"));

//NOTIFICATIONS
const Notifications = lazy(() => import("@/components/Notifications/Notifications"));
const NotificationsArticles = lazy(() => import("@/components/Notifications/NotificationsArticles"));

//SETTINGS
const Settings = lazy(() => import("@/components/Settings/Settings"));
const SettingsSystem = lazy(() => import("@/components/Settings/SettingsSystem"));
const SettingsAccount = lazy(() => import("@/components/Settings/SettingsAccount"));

const ChangePassword = lazy(() => import("@/components/Settings/ChangePassword"));
const ForgotPassword = lazy(() => import("@/components/Settings/ForgotPassword"));
const ResetPassword = lazy(() => import("@/components/Settings/ResetPassword"));

const InviteUser = lazy(() => import("@/components/Settings/InviteUser"));

//PROFILE
const Profile = lazy(() => import("@/components/ProfileUser/PageProfile"));
const EditProfile = lazy(() => import("@/components/ProfileUser/EditProfile"));
const FollowersList = lazy(() => import("@/components/ProfileUser/FollowersList"));
const FollowingList = lazy(() => import("@/components/ProfileUser/FollowingList"));

//CHAT
const CreateGroup = lazy(() => import("@/components/Chat/CreateGroup"));
const GroupSettings = lazy(() => import("@/components/Chat/GroupSettings"));

//INDEX
const Login = lazy(() => import("@/components/Auth/Login"));
const Register = lazy(() => import("@/components/Auth/Register"));
const NotFound = lazy(() => import("@/shared/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },

  {
    element: <Layout />,
    children: [
      { element: <AuthGuard />, children: [
        { path: "/home", element: <Home /> },
        { path: "/community", element: <Community/>},

        { path: "/create/article", element: <CreateArticle document={false} /> },
        { path: "/create/document", element: <CreateArticle document={true} /> },

        { path: "/post/:id", element: <Commentbox /> },

        { path: "/notifications", element: <Notifications /> },
        { path: "/notifications/post", element: <NotificationsArticles /> },

        { path: "/settings", element: <Settings /> },
        { path: "/settings/sistema", element: <SettingsSystem /> },
        { path: "/settings/cuenta", element: <SettingsAccount /> },
        { path: "/settings/cuenta/contraseña", element: <ChangePassword /> },
        { path: "/settings/cuenta/olvide-contraseña", element: <ForgotPassword /> },
        { path: "/settings/cuenta/restablecer-contraseña", element: <ResetPassword /> },

        { path: "/user/:id", element: <Profile /> },
        { path: "/user/:categoria", element: <Profile /> },
        { path: "/user/editar", element: <EditProfile /> },
        { path: "/user/following", element: <FollowingList /> },
        { path: "/user/seguidores", element: <FollowersList /> },
        { path: "/user/:id/following", element: <FollowingList /> },
        { path: "/user/:id/seguidores", element: <FollowersList /> },

        { path: "/chat/crear", element: <CreateGroup /> },
        { path: "/chat/grupo/:id", element: <GroupSettings /> },

        { path: "/invitar-usuario", element: <InviteUser /> },
      ]},
    ],
  },

  { path: "*", element: <NotFound /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);
