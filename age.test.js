// Jalankan: node age.test.js
const assert = require("node:assert");
const { ageInfo, nextBirthday, birthdayP } = require("./script.js");
const at = (s) => new Date(s + "T12:00:00");

assert.deepStrictEqual(ageInfo("2002-11-06", at("2026-11-06")), { years: 24, days: 0, untilNext: 365 });
assert.deepStrictEqual(ageInfo("2002-11-06", at("2026-11-05")), { years: 23, days: 364, untilNext: 1 });
assert.deepStrictEqual(ageInfo("2002-11-06", at("2027-01-01")), { years: 24, days: 56, untilNext: 309 });
assert.deepStrictEqual(ageInfo("2004-02-29", at("2027-02-28")), { years: 22, days: 364, untilNext: 1 });
assert.deepStrictEqual(ageInfo("2002-11-10", at("2026-11-09")), { years: 23, days: 364, untilNext: 1 });

// hitung mundur: 12 jam sebelum tengah malam 10 Nov, dan setelah lewat pindah ke tahun depan
assert.strictEqual(nextBirthday("2002-11-10", at("2026-11-09")) - at("2026-11-09"), 12 * 3600e3);
assert.strictEqual(nextBirthday("2002-11-10", at("2026-11-10")).getFullYear(), 2027);
// angka di kuis: 23 orang adalah jumlah minimum agar peluangnya > 50%
assert.ok(birthdayP(22) < 0.5 && birthdayP(23) > 0.5);
assert.strictEqual(birthdayP(22).toFixed(3), "0.476");
assert.strictEqual(birthdayP(23).toFixed(3), "0.507");
assert.strictEqual(birthdayP(60).toFixed(3), "0.994");
console.log("ok");
