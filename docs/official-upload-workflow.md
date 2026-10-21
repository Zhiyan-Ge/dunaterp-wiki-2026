# Official iGEM upload and release workflow

## Source-document heading hierarchy

When converting supplied Word documents into Wiki content, preserve the
author's visual hierarchy instead of inferring headings from font size or
paragraph position alone:

- **Bold and centred text** is a major section heading and should become a
  top-level content section on the page.
- **Bold but not centred text** is a minor heading inside the current major
  section.
- Body paragraphs remain body copy even when they immediately follow an image,
  table or page break.

If Word style names conflict with the visible formatting, the visible
alignment-and-weight rule above takes priority.

This repository cannot contain images, video or audio. The official GitLab
pre-receive hook rejects those files even when the Pages archive would remain
below its size limit. Images and PDFs must be uploaded to iGEM's asset service
first, then referenced by their returned `static.igem.wiki` URL.

## Fixed identifiers

- Team ID: `6212`
- Wiki repository UUID: `f830e239-f36f-4880-8fb2-497ab440ec1f`
- API base: `https://api.igem.org/v1`
- Official Git remote: `https://gitlab.igem.org/2026/scu-china.git`
- Published site: `https://2026.igem.wiki/scu-china/`

The repository UUID can be checked without authentication:

```sh
curl -fsS 'https://api.igem.org/v1/teams/6212/repositories' | jq
```

## 1. Prepare a cache-safe asset

Use a content hash in every replacement filename. The iGEM CDN may cache an old
object for up to 24 hours, so do not overwrite a previously published name.

```sh
shasum -a 256 path/to/asset.webp
# Example: yinuo-wang-7e1590b804a9.webp
```

Keep the source file outside Git. Do not force-add it to the official Wiki
repository.

## 2. Create a command-line iGEM session

The iGEM login is stored in macOS Keychain under `api.igem.org`, so it only has
to be entered once. The password is never written to the repository, a script
or a plain-text configuration file. The session cookie remains short-lived and
outside the project.

On the first upload, save the login securely:

```sh
printf 'iGEM identifier: '
IFS= read -r IGEM_IDENTIFIER
printf 'iGEM password: '
stty -echo
IFS= read -r IGEM_PASSWORD
stty echo
printf '\n'

printf 'protocol=https\nhost=api.igem.org\npath=v1/auth/sign-in\nusername=%s\npassword=%s\n\n' \
  "$IGEM_IDENTIFIER" "$IGEM_PASSWORD" | git credential-osxkeychain store
unset IGEM_PASSWORD
```

For this and later uploads, retrieve the login and create a session:

```sh
IGEM_CREDENTIAL="$(printf 'protocol=https\nhost=api.igem.org\npath=v1/auth/sign-in\n\n' \
  | git credential-osxkeychain get)"
IGEM_IDENTIFIER="$(printf '%s\n' "$IGEM_CREDENTIAL" | sed -n 's/^username=//p')"
IGEM_PASSWORD="$(printf '%s\n' "$IGEM_CREDENTIAL" | sed -n 's/^password=//p')"
IGEM_COOKIE_JAR="$(mktemp -t igem-cookie.XXXXXX)"
chmod 600 "$IGEM_COOKIE_JAR"

curl -fsS \
  -c "$IGEM_COOKIE_JAR" \
  -H 'Content-Type: application/json' \
  --data "$(jq -n \
    --arg identifier "$IGEM_IDENTIFIER" \
    --arg password "$IGEM_PASSWORD" \
    '{identifier: $identifier, password: $password}')" \
  'https://api.igem.org/v1/auth/sign-in' >/dev/null

unset IGEM_PASSWORD IGEM_CREDENTIAL
curl -fsS -b "$IGEM_COOKIE_JAR" \
  'https://api.igem.org/v1/auth/me' | jq '{username, firstName, lastName}'
```

If the password changes, remove the saved item and run the first-upload block
again:

```sh
printf 'protocol=https\nhost=api.igem.org\npath=v1/auth/sign-in\n\n' \
  | git credential-osxkeychain erase
```

## 3. Upload to the official Wiki repository

The upload request is multipart form data. `file` is the required field and
`directory` selects the folder shown by Wiki Uploads.

```sh
ASSET='path/to/yinuo-wang-7e1590b804a9.webp'

curl -fsS \
  -b "$IGEM_COOKIE_JAR" \
  -F "file=@${ASSET};type=image/webp" \
  'https://api.igem.org/v1/teams/6212/repositories/f830e239-f36f-4880-8fb2-497ab440ec1f/files?directory=team'
```

A successful upload returns HTTP 201 with an empty body. Query the folder and
copy the exact `https://static.igem.wiki/teams/6212/wiki/...` URL for the new
filename:

```sh
curl -fsS -b "$IGEM_COOKIE_JAR" \
  'https://api.igem.org/v1/teams/6212/repositories/f830e239-f36f-4880-8fb2-497ab440ec1f/files?directory=team' \
  | jq --arg name "$(basename "$ASSET")" '.[] | select(.name == $name)'
```

Then delete the session cookie:

```sh
rm -f "$IGEM_COOKIE_JAR"
unset IGEM_COOKIE_JAR IGEM_IDENTIFIER ASSET
```

## 4. Record and validate the returned URL

Update all applicable records:

- `src/content/deploy-assets.json`: runtime source-to-CDN mapping.
- `docs/igem-cdn-assets.json`: source path, returned URL, SHA-256 and byte size.
- A feature-specific source manifest such as `docs/team-photo-sources.json`.

Confirm that the CDN serves the expected bytes and media type:

```sh
curl -fsSI 'RETURNED_STATIC_IGEM_URL'
curl -fsS 'RETURNED_STATIC_IGEM_URL' | shasum -a 256
```

Run the complete local release checks:

```sh
npm run lint
npm run build
npm run deploy:prepare
git diff --check
```

`npm run deploy:prepare` must report no missing mapping and remain under the
official archive budget.

## 5. Publish the code

Before pushing, inspect the staged tree and make sure no image, video, audio,
cookie jar, password or unrelated work is included.

```sh
git status --short
git diff --cached --stat
git fetch igem main
git rebase igem/main
git push igem HEAD:main
```

After GitLab CI succeeds, verify the page, the text change and the exact CDN URL
on `https://2026.igem.wiki/scu-china/`. A push is not complete until both the
pipeline and live-site checks pass.

