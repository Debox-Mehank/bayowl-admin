import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout/layout";
import Services from "../components/services/services";
import Dashboard from "../components/services/services";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <Layout>
      <Services />
    </Layout>
  );
};

export default Home;
