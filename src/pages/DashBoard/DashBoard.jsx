import { useState } from "react";
import { useUser } from "../../context/userContext/userContext";
import { useAuth } from "../../context/authContext/authContext";
import { useEffect } from "react";
import axios from "axios";

//Components

export default function Dashboard() {
  const { user } = useUser();
  const { cookies } = useAuth();

  return <></>;
}
