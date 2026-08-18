const bcrypt = require("bcryptjs");
const db = require("./config/db");


// ========================================
// PASSWORD BARU
// ========================================

const passwordKetua = "ketua2026";
const passwordBendahara = "bendahara2025";
const passwordUser = "user2024";


// ========================================
// HASH PASSWORD
// ========================================

async function updatePasswords() {

    try {

        const hashKetua = await bcrypt.hash(
            passwordKetua,
            10
        );

        const hashBendahara = await bcrypt.hash(
            passwordBendahara,
            10
        );

        const hashUser = await bcrypt.hash(
            passwordUser,
            10
        );


        console.log("");
        console.log("Hash berhasil dibuat.");
        console.log("");


        // ========================================
        // UPDATE KETUA
        // ========================================

        db.run(
            "UPDATE users SET password = ? WHERE id = 1",
            [hashKetua],
            function (err) {

                if (err) {
                    console.error(
                        "Gagal update Ketua:",
                        err
                    );
                    return;
                }

                console.log(
                    `Ketua: ${this.changes} data diperbarui`
                );

            }
        );


        // ========================================
        // UPDATE BENDAHARA
        // ========================================

        db.run(
            "UPDATE users SET password = ? WHERE id = 2",
            [hashBendahara],
            function (err) {

                if (err) {
                    console.error(
                        "Gagal update Bendahara:",
                        err
                    );
                    return;
                }

                console.log(
                    `Bendahara: ${this.changes} data diperbarui`
                );

            }
        );


        // ========================================
        // UPDATE USER
        // ========================================

        db.run(
            "UPDATE users SET password = ? WHERE id = 3",
            [hashUser],
            function (err) {

                if (err) {
                    console.error(
                        "Gagal update User:",
                        err
                    );
                    return;
                }

                console.log(
                    `User: ${this.changes} data diperbarui`
                );

            }
        );


        // ========================================
        // TUNGGU UPDATE SELESAI
        // ========================================

        setTimeout(() => {

            console.log("");
            console.log(
                "======================================="
            );
            console.log(
                "PASSWORD BERHASIL DIPERBARUI"
            );
            console.log(
                "======================================="
            );
            console.log(
                "Ketua     : Ketua123"
            );
            console.log(
                "Bendahara : Bendahara123"
            );
            console.log(
                "User      : User123"
            );
            console.log(
                "======================================="
            );
            console.log("");

            db.close();

        }, 1000);

    } catch (error) {

        console.error(
            "ERROR:",
            error
        );

        db.close();

    }
}


updatePasswords();