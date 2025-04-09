"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { opacity, expand } from "./stairsAnim";
import "../styles/stairs-transition.css";

export default function Stairs({ children, backgroundColor }: { children: ReactNode; backgroundColor: string }) {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anim = (variants: any, custom: number | null = null) => {

    return {
      initial: "initial",
      animate: "enter",
      exit: "exit",
      custom,
      variants
    }
  }

  const nCols = 5;

  return (
    <div className='page stairs' style={{backgroundColor}}>
      <motion.div {...anim(opacity)} className='transition-background'/>
      <div className='transition-container'>
        {
          [...Array(nCols)].map( (_, i) => {
            return (
              <motion.div key={i} {...anim(expand, nCols - i)}/>
            ) 
          })
        }
      </div>
      {
        children
      }
    </div>
  );
}