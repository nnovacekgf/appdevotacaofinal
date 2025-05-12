import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs";

const fileInput = document.getElementById("file-input");
const coopList = document.getElementById("cooperative-list");
const favorList = document.getElementById("favor-list");
const againstList = document.getElementById("against-list");
const favorCount = document.getElementById("favor-count");
const againstCount = document.getElementById("against-count");
const errorMessage = document.getElementById("error-message");

fileInput.addEventListener("change", handleFile);

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  const ext = file.name.split(".").pop().toLowerCase();

  if (["csv", "xls", "xlsx"].includes(ext)) {
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      renderCooperatives(json);
    };
    reader.readAsArrayBuffer(file);
  } else if (ext === "json") {
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        renderCooperatives(json);
      } catch (err) {
        showError("Erro ao processar JSON.");
      }
    };
    reader.readAsText(file);
  } else {
    showError("Formato não suportado.");
  }
}

function renderCooperatives(data) {
  coopList.innerHTML = "";
  favorList.innerHTML = "";
  againstList.innerHTML = "";
  let favor = 0;
  let against = 0;

  data.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.nome || item.cooperativa || "Sem nome";
    coopList.appendChild(li);

    if (item.voto?.toLowerCase() === "favor") {
      favorList.appendChild(li.cloneNode(true));
      favor++;
    } else if (item.voto?.toLowerCase() === "contra") {
      againstList.appendChild(li.cloneNode(true));
      against++;
    }
  });

  favorCount.textContent = favor;
  againstCount.textContent = against;
}

function showError(msg) {
  errorMessage.textContent = msg;
}