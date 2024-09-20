// src/RouterList.js
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";
import LoginLayout from "./layout/LoginLayout.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import UserLayout from "./layout/UserLayout.jsx";
import ChatLayout from "./layout/ChatLayout.jsx";
import FormLayout from "./layout/FormLayout.jsx";
import Chat from "./pages/chat/Chat.jsx";
import ChatList from "./pages/chat/ChatList.jsx";
import IntroForm from "./pages/form/IntroForm.jsx";
import LoginForm from "./pages/form/LoginForm.jsx";
import SignUpForm from "./pages/form/SignUpForm.jsx";
import UpdateForm from "./pages/form/UpdateForm.jsx";
import UploadForm from "./pages/form/UploadForm.jsx";
import Main from "./pages/main/Main.jsx";
import Post from "./pages/main/Post.jsx";
import UserMain from "./pages/user/UserMain.jsx";
import UserInterestMoreList from "./pages/user/UserInterestMoreList.jsx";
import UserUploadMoreList from "./pages/user/UserUploadMoreList.jsx";
import WrongPath from "./pages/wrong/WrongPath.jsx";
import WrongPathUser from "./pages/wrong/WrongPathUser.jsx";
import Loading from "./Loading.jsx";

export const RouterList = () => [
  {
    // Login and Registration
    path: "/",
    element: <LoginLayout />,
    children: [
      {
        path: "intro",
        element: <IntroForm />,
      },
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "signup",
        element: <SignUpForm />,
      },
    ],
  },
  {
    // Main
    path: "/",
    element: <PrivateRoute><MainLayout /></PrivateRoute>,
    children: [
      {
        path: "main",
        element: <Main />,
      },
      {
        path: "main/:postId",
        element: <Post />,  // Post 컴포넌트가 :postId 파라미터를 사용함
      },
    ],
  },
  {
    // Form
    path: "/",
    element: <PrivateRoute><FormLayout /></PrivateRoute>,
    children: [
      {
        path: "upload",
        element: <UploadForm />,
      },
      {
        path: "update/:postId",
        element: <UpdateForm />,
      },
    ],
  },
  {
    // User
    path: "user",
    element: <PrivateRoute><UserLayout /></PrivateRoute>,
    children: [
      {
        path: "main/:userDocId",
        element: <UserMain />,
      },
      {
        path: "upload/:userDocId",
        element: <UserUploadMoreList />,
      },
      {
        path: "interest/:userDocId",
        element: <UserInterestMoreList />,
      },
      {
        path: "*",
        element: <WrongPathUser />,
      },
    ],
  },
  {
    // Chat
    path: "chats",
    element: <PrivateRoute><ChatLayout /></PrivateRoute>,
    children: [
      {
        index: true,
        element: <ChatList />,
      },
      {
        path: ":chatId",
        element: <Chat />,
      },
    ],
  },
  {
    // Loading
    path : "loading",
    element: <Loading />
  },
  {
    path: "*",
    element: <WrongPath />,
  },
];

export const RouterObject = createBrowserRouter(RouterList());
