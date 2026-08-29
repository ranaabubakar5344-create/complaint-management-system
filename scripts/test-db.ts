// import "dotenv/config";
// import { prisma } from "../lib/prisma";

// async function main() {
//   try {
//     const managers = await prisma.manager.findMany();

//     console.log("DB CONNECTION OK");
//     console.log(managers);
//   } catch (error) {
//     console.error("DB CONNECTION FAILED");
//     console.error(error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main();

import "dotenv/config";
import {prisma} from "../lib/prisma";

async  function main() {

  try {

    const managers= await prisma.manager.findMany();

    console.log("DB connection ok ");
    console.log(managers);



  } catch (error){

  console.error("connection failed");
  console.error(error);

  } finally {
    await prisma.$disconnect();
    
  }

}