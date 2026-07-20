import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";

//COMPONENTS
import Layout from "@/components/Layout";

// MAIN
const Home = lazy(() => import("@/components/Home/Home"));

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
// const OtherProfile = lazy(() => import("@/components/ProfileUser/OtherProfile"));

//CHAT
// const Chat = lazy(() => import("@/components/Chat/Chat"));
const CreateGroup = lazy(() => import("@/components/Chat/CreateGroup"));
const GroupSettings = lazy(() => import("@/components/Chat/GroupSettings"));

//INDEX
const Login = lazy(() => import("@/components/Auth/Login"));
const Register = lazy(() => import("@/components/Auth/Register"));
const NotFound = lazy(() => import("@/shared/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/inicio" replace />,
  },

  {
    element: <Layout />,
    children: [
      //HOME
      { path: "/:categoria", element: <Home /> },

      //CREATE ARTICLE
      { path: "/publicar/texto", element: <CreateArticle document={false} /> },
      { path: "/publicar/documento", element: <CreateArticle document={true} /> },

      //ARTICLE INFO
      { path: "/detalles/:id", element: <Commentbox /> },

      //NOTIFICATIONS
      { path: "/notificaciones", element: <Notifications /> },
      { path: "/notificaciones/publicaciones", element: <NotificationsArticles /> },
      // { path: "/notificaciones/eventos", element: <NotificationsEvents /> },
      { path: "/notificaciones/comentarios", element: <NotificationsArticles /> },

      //SETTINGS
      { path: "/ajustes", element: <Settings /> },
      { path: "/ajustes/sistema", element: <SettingsSystem /> },
      { path: "/ajustes/cuenta", element: <SettingsAccount /> },
      { path: "/ajustes/cuenta/contraseña", element: <ChangePassword /> },
      { path: "/ajustes/cuenta/olvide-contraseña", element: <ForgotPassword /> },
      { path: "/ajustes/cuenta/restablecer-contraseña", element: <ResetPassword /> },

      //PROFILE
      { path: "/perfil/:id", element: <Profile /> },
      { path: "/perfil/:categoria", element: <Profile /> },
      { path: "/perfil/editar", element: <EditProfile /> },
      { path: "/perfil/siguiendo", element: <FollowingList /> },
      { path: "/perfil/seguidores", element: <FollowersList /> },
      // { path: "/otroperfil/:id", element: <OtherProfile /> },

      //CHAT
      // { path: "/chat", element: <Chat /> },
      { path: "/chat/crear", element: <CreateGroup /> },
      { path: "/chat/grupo/:id", element: <GroupSettings /> },

      { path: "/invitar-usuario", element: <InviteUser /> },
    ],
  },

  //INDEX
  { path: "*", element: <NotFound /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);
