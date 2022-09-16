import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import Login from "../components/login/login";
import { useMeAdminLazyQuery } from "../generated/graphql";

const Home: NextPage = () => {
  const [meAdmin] = useMeAdminLazyQuery();
  const [pageDecider, setPageDecider] = useState<string>("");
  useEffect(() => {
    const useQuery = async () => {
      const response = await meAdmin();
      setPageDecider(response.data!.meAdmin);
    };
    useQuery();
  }, []);
  if (pageDecider === "false" || !pageDecider) return <Login />;
  return <Layout />;
};

export default Home;
