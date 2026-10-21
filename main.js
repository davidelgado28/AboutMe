function buildHeatmap() {
      const grid = document.getElementById('heatmapGrid');
      grid.innerHTML = '';

      for (let i = 0; i < 52; i++) {
        const col = document.createElement('div');
        col.className = 'heatmap-col';
        for (let j = 0; j < 7; j++) {
          const cell = document.createElement('div');
          cell.className = 'heatmap-cell';
          
          const rand = Math.random();
          let level = 0;
          if (rand > 0.75) level = 1;
          if (rand > 0.88) level = 2;
          if (rand > 0.94) level = 3;
          if (rand > 0.98) level = 4;

          if (level > 0) {
            cell.setAttribute('data-level', level);
          }
          col.appendChild(cell);
        }
        grid.appendChild(col);
      }
    }
    buildHeatmap();
    function filterProjects(lang) {
      const buttons = document.querySelectorAll('.filter-btn');
      buttons.forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');

      const cards = document.querySelectorAll('.repo-card');
      cards.forEach(card => {
        if (lang === 'all' || card.getAttribute('data-lang') === lang) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    let currentRepo = null;

    function openCodeModal(repoKey) {
      currentRepo = repoData[repoKey];
      if (!currentRepo) return;

      const modal = document.getElementById('codeModal');
      const fileTree = document.getElementById('modalFileTree');
      
      fileTree.innerHTML = '';
      
      const fileNames = Object.keys(currentRepo.files);
      fileNames.forEach((fileName, index) => {
        const li = document.createElement('li');
        li.className = `file-item ${index === 0 ? 'active' : ''}`;
        li.innerHTML = `<i class="fa-regular fa-file"></i> ${fileName}`;
        li.onclick = () => selectFile(fileName, li);
        fileTree.appendChild(li);
      });
      selectFile(fileNames[0]);

      modal.classList.add('active');
    }

    function selectFile(fileName, element) {
      if (element) {
        document.querySelectorAll('.file-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
      }

      document.getElementById('modalFileName').innerText = fileName;
      const content = currentRepo.files[fileName];
      const editorView = document.getElementById('modalCodeView');

      const lines = content.split('\n');
      editorView.innerHTML = lines.map((line, idx) => `
        <div class="code-line">
          <span class="line-num">${idx + 1}</span>
          <span>${escapeHtml(line)}</span>
        </div>
      `).join('');
    }

    function closeCodeModal() {
      document.getElementById('codeModal').classList.remove('active');
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    const termInput = document.getElementById('termInput');
    const termOutput = document.getElementById('terminalOutput');

    const commands = {
      'help': 'Available commands: <span style="color:#0284c7">skills</span>, <span style="color:#0284c7">projects</span>, <span style="color:#0284c7">about</span>, <span style="color:#0284c7">contact</span>, <span style="color:#0284c7">clear</span>',
      'skills': 'Languages:    C, C++, JavaScript, Python, Java, HTML, CSS, PHP<br>Tecnologias: Hugging Face, MySQL, VSCode, Eclipse IDE, Apache NetBeans, Git, Github, OpenCV, Matplotlib',
      'projects': 'Main repositories: ASCII-Converter, decimal-to-binary-converter, Projeto-Letrar, Carlinho-Mathematiques',
      'about': 'David Carlos - Computer Vision Developer.',
      'contact': 'Email: davidelgado.tech@gmail.com | GitHub: https://github.com/davidelgado28'
    };

    termInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const cmd = this.value.trim().toLowerCase();
        this.value = '';

        const cmdLine = document.createElement('div');
        cmdLine.className = 'term-line';
        cmdLine.innerHTML = `<span class="term-prompt">davidelgado:~$</span> ${escapeHtml(cmd)}`;
        termOutput.appendChild(cmdLine);

        if (cmd === 'clear') {
          termOutput.innerHTML = '';
          return;
        }
        const responseLine = document.createElement('div');
        responseLine.className = 'term-line';
        
        if (commands[cmd]) {
          responseLine.innerHTML = commands[cmd];
        } else if (cmd !== '') {
          responseLine.innerHTML = `Comando não encontrado: "${escapeHtml(cmd)}". Digite <span style="color:#38bdf8">help</span>.`;
        }
        termOutput.appendChild(responseLine);
        termOutput.scrollTop = termOutput.scrollHeight;
      }
    });