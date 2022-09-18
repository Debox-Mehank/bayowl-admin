import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import Login from "../components/login/login";
import { useMeAdminLazyQuery } from "../generated/graphql";

const Home: NextPage = () => {
  const [meAdmin] = useMeAdminLazyQuery();
  const [pageDecider, setPageDecider] = useState<string>("");
  const getRole = async () => {
    try {
      const response = await meAdmin();

      if (response.error) {
        console.log(response.error);
        return;
      }

      if (!response.data || !response.data.meAdmin) {
        return;
      }

      localStorage.setItem("admin", JSON.stringify(response.data?.meAdmin));
      setPageDecider(
        response.data!.meAdmin?.name
          ? response.data?.meAdmin.type ?? ""
          : "false"
      );
    } catch (error: any) {
      setPageDecider("false");
    }
  };
  useEffect(() => {
    getRole();
  }, []);
  if (pageDecider === "false" || !pageDecider) return <Login />;
  return <Layout typeRole={pageDecider} />;
};

export default Home;
