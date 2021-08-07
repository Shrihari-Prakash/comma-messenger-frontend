import React from "react";
import { useHistory } from "react-router-dom";
import Splits from "../components/Splits";
import { isLoggedIn } from "../utils/auth";
import routes from "../utils/routes";

export default function SplitsPage() {
  const history = useHistory();
  if (!isLoggedIn()) {
    history.push(routes.login);
  }

  return <Splits></Splits>;
}
