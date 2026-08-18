const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "bendahara.db"),
  (err) => {
    if (err) {
      console.error("Gagal membuka database:", err.message);
      return;
    }

    console.log("====================================");
    console.log("MEMBUAT / MEMPERBAIKI DATA USER");
    console.log("====================================");
  }
);


// ========================================
// DATA USER
// ========================================

const users = [
  {
    nama: "Ketua",
    email: "ketua@gmail.com",
    password: "123456",
    role: "ketua",
  },

  {
    nama: "Bendahara",
    email: "bendahara@gmail.com",
    password: "123456",
    role: "bendahara",
  },

  {
    nama: "User",
    email: "user@gmail.com",
    password: "123456",
    role: "user",
  },
];


// ========================================
// PROSES USER
// ========================================

let selesai = 0;


users.forEach((user) => {

  db.get(
    "SELECT id FROM users WHERE email = ?",
    [user.email],
    (err, row) => {

      // ==================================
      // ERROR DATABASE
      // ==================================

      if (err) {

        console.error(
          `Error mengecek ${user.email}:`,
          err.message
        );

        selesai++;

        checkFinished();

        return;
      }


      // ==================================
      // USER SUDAH ADA
      // ==================================

      if (row) {

        db.run(
          `
          UPDATE users
          SET
            nama = ?,
            password = ?,
            role = ?
          WHERE email = ?
          `,
          [
            user.nama,
            user.password,
            user.role,
            user.email,
          ],
          function (updateErr) {

            if (updateErr) {

              console.error(
                `❌ Gagal memperbarui ${user.email}:`,
                updateErr.message
              );

            } else {

              console.log(
                `🔄 ${user.email} berhasil diperbarui`
              );

            }

            selesai++;

            checkFinished();

          }
        );

        return;
      }


      // ==================================
      // USER BELUM ADA
      // ==================================

      db.run(
        `
        INSERT INTO users
        (
          nama,
          email,
          password,
          role
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          user.nama,
          user.email,
          user.password,
          user.role,
        ],
        function (insertErr) {

          if (insertErr) {

            console.error(
              `❌ Gagal menambahkan ${user.email}:`,
              insertErr.message
            );

          } else {

            console.log(
              `✅ ${user.email} berhasil ditambahkan`
            );

          }

          selesai++;

          checkFinished();

        }
      );

    }
  );

});


// ========================================
// CEK SELESAI
// ========================================

function checkFinished() {

  if (selesai !== users.length) {
    return;
  }


  console.log("");

  console.log("====================================");

  console.log("SEED USER SELESAI");

  console.log("====================================");

  console.log("");

  console.log("Akun login:");

  console.log(
    "Ketua     : ketua@gmail.com / 123456"
  );

  console.log(
    "Bendahara : bendahara@gmail.com / 123456"
  );

  console.log(
    "User      : user@gmail.com / 123456"
  );

  console.log("");

  db.close((err) => {

    if (err) {

      console.error(
        "Gagal menutup database:",
        err.message
      );

    } else {

      console.log(
        "Database ditutup."
      );

    }

  });

}