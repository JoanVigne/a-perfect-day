"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FormWorkout from "./components/FormWorkout";
import "./workout.css";

export default function Page() {
  return (
    <>
      <Header />
      <h1>Workout</h1>
      <FormWorkout />
      <Footer />
    </>
  );
}
