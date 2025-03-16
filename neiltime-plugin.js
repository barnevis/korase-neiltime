import { markdownToOutput as marked } from "shahneshan";
import "./neiltime-plugin.css";

function escapeHTML(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function convertToNumber(text) {
  const persianToEnglishMap = {
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
  };
  return Number(text.replace(/[\u06F0-\u06F9]/g, char => persianToEnglishMap[char]));
}

const neiltimePlugin = {
  name: "neiltimePlugin",
  beforeParse: (text) => {
    return text.replace(/\.{3}گاهنما([\s\S]*?)\.{3}/g, (match, content) => {
      let maxWidth = '';
      const lines = content
        .trim()
        .split('\n')
        .map(line => line.trim()) // Trim all lines
        .filter(line => line); // Remove empty lines
      
      const regexNumber = /^[0-9\u06F0-\u06F9]*$/;

      if(regexNumber.test(lines[0])){
        let size = convertToNumber(lines[0]);
        if(size){
          maxWidth = 'style="max-width: '+size+'px;"'
        }
      }

      let neiltimeHTML = '<div class="neiltime"><div class="neiltime-container" '+maxWidth+' >';
      let currentItem = null;
      
      lines.forEach(line => {
        if (line.startsWith('-')) {
          
          // If there's an active item, finalize it
          if (currentItem) {
            neiltimeHTML += `
              <div class="neiltime-item">
                <div class="neiltime-item-content">
                  <h4>${marked(currentItem.title)}</h4>
                  <div class="text">
                    ${marked(currentItem.description)}
                  </div>
                </div>
                <div class="neiltime-circle"></div>
              </div>
            `;
          }

          // Start a new neiltime item
          currentItem = {
            title: line.substring(1).trim(),
            image: '',
            date: '',
            description: ''
          };
        } else if (line.startsWith(':')) {
          // Description subdata
          currentItem.description += line.substring(1) + '  \n';
        }
      });

      // Finalize the last item
      if (currentItem) {
        neiltimeHTML += `
          <div class="neiltime-item">
            <div class="neiltime-item-content">
              <h4>${marked(currentItem.title)}</h4>
              <div class="text">
                ${marked(currentItem.description)}
              </div>
            </div>
            <div class="neiltime-circle"></div>
          </div>
        `;
      }

      neiltimeHTML += '</div></div>';
      return neiltimeHTML;
    });
  }
};

export default neiltimePlugin;
