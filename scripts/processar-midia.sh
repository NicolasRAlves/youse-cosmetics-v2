#!/usr/bin/env bash
# =============================================================================
# Youse Cosmetics · v2 — processamento de mídia (precisa do ffmpeg no PATH)
#
#   bash scripts/processar-midia.sh                 # usa ../Youse-Cosmetics-main
#   bash scripts/processar-midia.sh "C:/caminho/da/pasta/com/img-e-video"
#
# Gera, a partir dos originais (pasta da v1, que NUNCA é alterada):
#   - produtos: recorte do espaço transparente + WebP 1200/600/300 + PNG 800 + imagem de compartilhamento (og)
#   - fotos da home: WebP 1200/600 + JPG
#   - antes/depois: quadros dos vídeos 1 e 3
#   - posters dos vídeos + vídeos recomprimidos (H.264, crf 28)
#   - logo horizontal, favicons e imagem de compartilhamento padrão
# Rode da pasta site-v2. Leva alguns minutos (os vídeos são a parte lenta).
# =============================================================================
set -u
cd "$(dirname "$0")/.."
ORIGEM="${1:-../Youse-Cosmetics-main}"
A="assets"
TMP="$(mktemp -d)"
FF="ffmpeg -v error -y"
mkdir -p "$A/img/produtos" "$A/img/home" "$A/img/antes-depois" "$A/img/og" "$A/img/brand" "$A/video"

webp_alpha() { $FF -i "$1" -vf "scale=$3:-1:flags=lanczos,format=yuva420p" -c:v libwebp -quality 82 "$2"; }
webp_rgb()   { $FF -i "$1" -vf "scale=$3:-1:flags=lanczos" -c:v libwebp -quality ${4:-78} "$2"; }
jpg()        { $FF -i "$1" -vf "scale=$3:-1:flags=lanczos" -q:v ${4:-4} "$2"; }

echo "== Produtos"
# arquivo = cor do produto (fundo da imagem de compartilhamento). Mantenha igual a data/produtos.js
declare -A COR=( [youliss_2]=E7339A [purify]=0D69CC [quiabo]=22C55E [btx]=2DD4BF [sos]=EF4444 [hydro]=65A30D [marrom]=B99062 [salao]=FB923C [glamour]=D946EF [blend]=F59E0B [rose]=E69094 [nato_azul]=2563EB )
for f in "$ORIGEM"/img/produtos/*.png; do
  n=$(basename "$f" .png)
  crop=$(ffmpeg -hide_banner -i "$f" -vf "alphaextract,format=yuv420p,cropdetect=limit=20:round=2:reset=0:skip=0" -f null - 2>&1 | grep -o "crop=[0-9:]*" | tail -1)
  [ -z "$crop" ] && crop="crop=iw:ih:0:0"
  $FF -i "$f" -vf "$crop,pad='ceil(max(iw,ih)*1.1/2)*2':'ceil(max(iw,ih)*1.1/2)*2':(ow-iw)/2:(oh-ih)/2:color=black@0,scale=1200:1200:flags=lanczos" -pix_fmt rgba "$TMP/$n.png"
  for w in 1200 600 300; do webp_alpha "$TMP/$n.png" "$A/img/produtos/$n-$w.webp" $w; done
  $FF -i "$TMP/$n.png" -vf "scale=800:-1:flags=lanczos" -compression_level 9 -pix_fmt rgba "$A/img/produtos/$n.png"
  [ -n "${COR[$n]:-}" ] && $FF -f lavfi -i "color=c=0x${COR[$n]}:s=1200x630" -i "$TMP/$n.png" -filter_complex "[1]scale=560:560[p];[0][p]overlay=(W-w)/2:(H-h)/2,format=yuv420p" -frames:v 1 -q:v 3 "$A/img/og/$n.jpg"
  echo "   $n ($crop)"
done

echo "== Fotos da home"
$FF -i "$ORIGEM/img/home/home1.png" -vf "crop=1024:920:0:0" "$TMP/linha.png"   # corta o selo ✦ do canto
webp_rgb "$TMP/linha.png" "$A/img/home/linha-completa-1200.webp" 1024; webp_rgb "$TMP/linha.png" "$A/img/home/linha-completa-600.webp" 600; jpg "$TMP/linha.png" "$A/img/home/linha-completa.jpg" 1024
for par in "youliss_home:youliss-lancamento" "home2:quiabo-natural" "btx_quiabo:btx-quiabo"; do
  src=${par%%:*}; dst=${par##*:}
  $FF -i "$ORIGEM/img/home/$src.png" -vf "scale=1400:-1:flags=lanczos,format=rgb24" "$TMP/$dst.png"
  webp_rgb "$TMP/$dst.png" "$A/img/home/$dst-1200.webp" 1200; webp_rgb "$TMP/$dst.png" "$A/img/home/$dst-600.webp" 600; jpg "$TMP/$dst.png" "$A/img/home/$dst.jpg" 1200
done

echo "== Antes/depois"
# Fotos reais (3:4) ficam em ../midia-extra/antes-depois/<nome>.png|jpg — ex.: youliss-antes.png, youliss-depois.png.
# Toda foto dessa pasta vira assets/img/antes-depois/<nome>.webp + .jpg (720×960).
EXTRA="${EXTRA:-../midia-extra/antes-depois}"
for f in "$EXTRA"/*.png "$EXTRA"/*.jpg "$EXTRA"/*.jpeg; do
  [ -f "$f" ] || continue
  n=$(basename "${f%.*}")
  $FF -i "$f" -vf "scale=720:960:force_original_aspect_ratio=increase,crop=720:960" "$TMP/$n.png"
  webp_rgb "$TMP/$n.png" "$A/img/antes-depois/$n.webp" 720 80; jpg "$TMP/$n.png" "$A/img/antes-depois/$n.jpg" 720 4
  echo "   $n (foto)"
done
# Quadros do vídeo "Salão em Casa" (início e fim)
quadro() { $FF -ss $2 -i "$ORIGEM/video/$1" -frames:v 1 -vf "crop=720:960:0:60" "$TMP/$3.png"; webp_rgb "$TMP/$3.png" "$A/img/antes-depois/$3.webp" 720 80; jpg "$TMP/$3.png" "$A/img/antes-depois/$3.jpg" 720 4; }
quadro video_3.mp4 1.0  salao-antes
quadro video_3.mp4 16.0 salao-depois

echo "== Posters"
poster() { $FF -ss $2 -i "$ORIGEM/video/$1" -frames:v 1 -vf "scale=540:960" "$TMP/$3.png"; webp_rgb "$TMP/$3.png" "$A/video/$3.webp" 540 75; jpg "$TMP/$3.png" "$A/video/$3.jpg" 540 5; }
poster video_1.mp4 28.0 poster-1
poster video_2.mp4 30.0 poster-2
poster video_3.mp4 16.0 poster-3

echo "== Marca"
$FF -i "$ORIGEM/img/logo.png" -vf "crop=1582:540:222:732,scale=480:-1:flags=lanczos,format=yuva420p" -c:v libwebp -quality 90 "$A/img/brand/logo.webp"
$FF -i "$ORIGEM/img/logo.png" -vf "crop=1582:540:222:732,scale=480:-1:flags=lanczos,format=rgba" "$A/img/brand/logo.png"
$FF -i "$ORIGEM/img/logo.png" -vf "crop=212:540:220:732,format=rgba" "$TMP/y.png"
icone() { $FF -f lavfi -i "color=c=0xE7339A:s=512x512" -i "$TMP/y.png" -filter_complex "[1]scale=-1:380[y];[0][y]overlay=(W-w)/2+6:(H-h)/2+6,scale=$1:$1:flags=lanczos,format=rgb24" -frames:v 1 "$2"; }
icone 512 "$A/img/brand/icon-512.png"; icone 192 "$A/img/brand/icon-192.png"; icone 180 "apple-touch-icon.png"; icone 32 "$A/img/brand/favicon-32.png"
$FF -i "$A/img/brand/icon-512.png" -vf scale=48:48 "favicon.ico"
$FF -f lavfi -i "color=c=0x0A0A0A:s=1200x630" -i "$ORIGEM/img/logo.png" -i "$ORIGEM/img/home/home1.png" -filter_complex "[1]scale=640:-1[l];[2]crop=1024:920:0:0,scale=-1:630,crop=560:630[h];[0][h]overlay=W-w:0[a];[a][l]overlay=0:(H-h)/2,drawbox=x=60:y=470:w=120:h=4:color=0xE7339A:t=fill,format=yuv420p" -frames:v 1 -q:v 3 "$A/img/og/youse.jpg"

echo "== Vídeos (pode demorar)"
for n in 1 2 3; do
  $FF -i "$ORIGEM/video/video_$n.mp4" -c:v libx264 -preset veryfast -crf 28 -profile:v high -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart "$A/video/video_$n.mp4"
done
rm -rf "$TMP"
echo "Pronto."
