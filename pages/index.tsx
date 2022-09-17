import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import Login from "../components/login/login";
import { useMeAdminLazyQuery } from "../generated/graphql";

const Home: NextPage = () => {
  const [meAdmin] = useMeAdminLazyQuery();
  const [pageDecider, setPageDecider] = useState<string>("");
  const getRole = async () => {
    const response = await meAdmin();
    setPageDecider(response.data!.meAdmin);
  };
  useEffect(() => {
    getRole();
  }, []);
  if (pageDecider === "false" || !pageDecider) return <Login />;
  return <Layout typeRole={pageDecider} />;
};

export default Home;
