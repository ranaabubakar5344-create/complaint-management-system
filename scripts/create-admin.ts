import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";

const databaseUrl= process.env.DATABASE_URL;

if(!databaseUrl){
  throw new Error("Database is not defined");
    
}

const adapter= new PrismaPg({
    connectionString:databaseUrl,
})

const prisma= new PrismaClient({ 
   adapter,
})

async function main() {
    const email= "admin@company.com";
    const password= "admin1234";

    const passwordHash=await bcrypt.hash(password,12);
    console.log("Admin Createed Successfully ");
    console.log({

        id : "admin.id",
        email: "admin.email",
        name: "admin.name",

    })

}
main()

.catch((error) =>{
console.error("Manger Creation Field :" );
console.error(error);
process.exit(1);
})
.finally(async() =>{
    await prisma.$disconnect();
    
})