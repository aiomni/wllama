#!/usr/bin/env bash

# Check if the system is macOS
if [ "$(uname)" != "Darwin" ]; then
  echo "Xllama is only supported on macOS yet."
  exit 1
fi

# Determine which shell configuration file to update
SHELL_CONFIG_FILE=""

if which zsh >/dev/null; then
    # This is zsh shell
    SHELL_CONFIG_FILE="$HOME/.zshrc"
else
    # This is bash shell
    SHELL_CONFIG_FILE="$HOME/.bash_profile"
    [ ! -f "$SHELL_CONFIG_FILE" ] && SHELL_CONFIG_FILE="$HOME/.bashrc"
fi

# Check if XLLAMA_HOME variable exists, if not, set it to $HOME/.xllama
if [ -z "${XLLAMA_HOME}" ]; then
  export XLLAMA_HOME="$HOME/.xllama"
  echo "Setting XLLAMA_HOME to $XLLAMA_HOME"
  
  # Update shell configuration file
  echo "Updating shell configuration file: $SHELL_CONFIG_FILE"
  echo "export XLLAMA_HOME=\"\$HOME/.xllama\"" >> "$SHELL_CONFIG_FILE"
  echo "export PATH=\"\$PATH:\$XLLAMA_HOME/bin\"" >> "$SHELL_CONFIG_FILE"
fi

# Create necessary directory
mkdir -p "${XLLAMA_HOME}/bin"

# Determine system architecture
ARCH=""
case $(uname -m) in
    "x86_64") ARCH="amd64" ;;
    "arm64") ARCH="arm64" ;;
    *) echo "Unsupported architecture"; exit 1 ;;
esac

# Define the file to download
REPO="aiomni/xllama"
FILE="xllama-darwin-${ARCH}"

# Fetch the download URL for the latest release from GitHub
DOWNLOAD_URL=$(curl -s https://api.github.com/repos/${REPO}/releases \
| grep "browser_download_url.*${FILE}" \
| cut -d '"' -f 4 \
| head -n 1)

# Check if the download URL is found
if [ -z "${DOWNLOAD_URL}" ]; then
  echo "Download URL not found for the releases."
  exit 1
fi

# Download the tar package
curl -L "${DOWNLOAD_URL}" -o "${XLLAMA_HOME}/${FILE}.tar.gz"

# Extract the tar package
tar -xzf "${XLLAMA_HOME}/${FILE}.tar.gz" -C "${XLLAMA_HOME}/bin"
mv "${XLLAMA_HOME}/bin/${FILE}" "${XLLAMA_HOME}/bin/xllama"


# Remove the tar package and extracted file
rm -f "${XLLAMA_HOME}/${FILE}.tar.gz"
rm -f "${XLLAMA_HOME}/bin/${FILE}"

echo "xllama has been installed to ${XLLAMA_HOME}/bin"

if [ -z "${XLLAMA_HOME}" ]; then
  echo "Please use the 'source' command to apply the changes immediately: source ${SHELL_CONFIG_FILE}"
fi
