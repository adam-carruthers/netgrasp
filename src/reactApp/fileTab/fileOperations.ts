export const saveFile = async (stringData: string) => {
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: "network.json",
    types: [
      {
        description: "JSON Files",
        accept: {
          "application/json": [".json"],
        },
      },
    ],
  });

  const writable = await fileHandle.createWritable();
  await writable.write(stringData);
  await writable.close();
};

export const readFile = async () => {
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  return file.text();
};
