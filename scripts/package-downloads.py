"""Executar depois de node build.js. Gera os arquivos da página /downloads/."""
from pathlib import Path
import shutil
import zipfile
root = Path(__file__).resolve().parent.parent
out = root / 'dist' / 'downloads'
out.mkdir(parents=True, exist_ok=True)
shutil.copy2(root / 'dist/vila-afrofuturista-offline.html', out / 'vila-afrofuturista.html')
shutil.copy2(root / 'SUGESTOES.md', out / 'sugestoes.md')
shutil.copy2(root / 'O-QUE-FALTA.md', out / 'o-que-falta.md')
shutil.copy2(root / '100-SUGESTOES.md', out / '100-sugestoes.md')
shutil.copy2(root / 'STATUS-100-SUGESTOES.md', out / 'status-100-sugestoes.md')
with zipfile.ZipFile(out / 'vila-afrofuturista-fontes.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for folder in ['src', 'vendor', 'tests', 'tools', 'scripts', 'assets']:
        for file in sorted((root / folder).rglob('*')):
            if file.is_file():
                archive.write(file, 'vila-afrofuturista/' + str(file.relative_to(root)))
    for name in ['README.md', 'SUGESTOES.md', 'VALIDACAO.md', 'build.js', 'package.json', 'package-lock.json', 'downloads.html', 'ESCOPO-METROPOLE.md', 'MELHORIAS-RECOMENDADAS.md', '100-SUGESTOES.md', 'STATUS-100-SUGESTOES.md', 'O-QUE-FALTA.md', '.nojekyll', '.gitignore']:
        archive.write(root / name, 'vila-afrofuturista/' + name)
    archive.write(root / 'dist/vila-afrofuturista-offline.html', 'vila-afrofuturista/dist/vila-afrofuturista-offline.html')
shutil.copy2(root / 'downloads.html', out / 'index.html')
print('Downloads prontos:', out)
