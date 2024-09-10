// src/RouterList.js
import { createBrowserRouter } from "react-router-dom";
import LoginLayout from "./layout/LoginLayout.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import UserLayout from "./layout/UserLayout.jsx";
import ChatLayout from "./layout/ChatLayout.jsx";
import Chat from "./pages/chat/Chat.jsx";
import ChatList from "./pages/chat/ChatList.jsx";
import LoginForm from "./pages/form/LoginForm.jsx";
import SignUpForm from "./pages/form/SignUpForm.jsx";
import UpdateForm from "./pages/form/UpdateForm.jsx";
import UploadForm from "./pages/form/UploadForm.jsx";
import Main from "./pages/main/Main.jsx";
import Post from "./pages/main/Post.jsx";
import UserMain from "./pages/user/UserMain.jsx";
import UserInterestList from "./pages/user/UserInterestList.jsx";
import UserUploadList from "./pages/user/UserUploadList.jsx";
import WrongPath from "./pages/Etc/WrongPath.jsx";

export const RouterList = () => [
  {
    // Login and Registration
    path: "/",
    element: <LoginLayout />,
    children: [
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "Signup",
        element: <SignUpForm />,
      },
    ],
  },
  {
    // Main
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "main",
        element: <Main />,
      },
      {
        path: "main/post",
        element: <Post />,
      },
      {
        path: "uploadForm",
        element: <UploadForm />,
      },
      {
        path: "updateForm",
        element: <UpdateForm />,
      },
    ],
  },
  {
    // User
    path: "user",
    element: <UserLayout />,
    children: [
      {
        path: "main",
        element: <UserMain />,
      },
      {
        path: "upload",
        element: <UserUploadList />,
      },
      {
        path: "interest",
        element: <UserInterestList />,
      },
    ],
  },
  {
    // Chat Routes
    path: "chats",
    element: <ChatLayout />,
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
    path: "*",
    element: <WrongPath />,
  },
];

export const RouterObject = createBrowserRouter(RouterList());
