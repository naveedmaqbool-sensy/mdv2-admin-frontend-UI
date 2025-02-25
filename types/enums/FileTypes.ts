enum FileTypes {
  CSV = 'csv',
}

namespace FileTypes {
  export function getAcceptMimeTypes(e: FileTypes) {
    switch (e) {
      case FileTypes.CSV:
        return ['text/csv']
    }
  }

  export function getAcceptFileName(e: FileTypes) {
    switch (e) {
      case FileTypes.CSV:
        return 'CSVファイル'
    }
  }
}

export default FileTypes
