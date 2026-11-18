"""Download original Pexels images and rewrite HTML to local copies.
Run from this folder while connected to the Internet: python download_images.py
"""
import csv, urllib.request, pathlib, html
root=pathlib.Path(__file__).parent
with open(root/'photo_sources.csv',encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
for row in rows:
    dest=root/'images'/row['filename']
    url=f"https://images.pexels.com/photos/{row['pexels_id']}/pexels-photo-{row['pexels_id']}.jpeg?auto=compress&cs=tinysrgb&w=1400"
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
        with urllib.request.urlopen(req,timeout=40) as res: data=res.read()
        if not data.startswith(b'\xff\xd8\xff'): raise ValueError('Downloaded data is not JPEG')
        dest.write_bytes(data)
        print('Downloaded',dest.name,len(data))
    except Exception as err:
        print('FAILED',dest.name,err)
for page in root.glob('*.html'):
    source=page.read_text(encoding='utf-8')
    modified=source
    for row in rows:
        dest=root/'images'/row['filename']
        if dest.exists():
            for w in (1400,680):
                remote=f"https://images.pexels.com/photos/{row['pexels_id']}/pexels-photo-{row['pexels_id']}.jpeg?auto=compress&amp;cs=tinysrgb&amp;w={w}"
                modified=modified.replace(remote,f'images/{row["filename"]}')
    if modified!=source: page.write_text(modified,encoding='utf-8'); print('Updated',page.name)
print('Done. Check gallery photos in browser.')
