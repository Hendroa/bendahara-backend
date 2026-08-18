const bcrypt = require("bcrypt");

async function main() {

  const passwords = {
    ketua: "Ketua@2026",
    bendahara: "Bendahara@2026",
    user: "User@2026",
  };

  for (const [role, password] of Object.entries(passwords)) {

    const hash = await bcrypt.hash(password, 10);

    console.log("==============================");
    console.log(role.toUpperCase());
    console.log("==============================");
    console.log(hash);
    console.log("");
  }
}

main();