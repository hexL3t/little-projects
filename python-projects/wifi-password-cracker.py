import subprocess
import platform
import os
import sys

def run_as_admin():
    """ Relaunches the script with admin privileges if needed. """
    if platform.system() == "Windows":
        if not is_admin():
            print("Re-running script as administrator...")
            subprocess.run(["powershell", "Start-Process", "python", f'"{sys.argv[0]}"', "-Verb", "RunAs"])
            sys.exit()
    elif platform.system() == "Darwin":
        if os.geteuid() != 0:
            print("Re-running script with sudo...")
            os.execvp("sudo", ["sudo", "python3"] + sys.argv)
            
def is_admin():
    """ Check if the script is running as administrator. """
    if platform.system() == "Windows":
        try:
            return subprocess.check_output("net session", shell=True, stderr=subprocess.DEVNULL) == b""
        except subprocess.CalledProcessError:
            return False
    else:
        return os.geteuid() == 0

def get_wifi_password_windows():
    """Retrieve and print saved WiFi passwords on Windows."""
    try:
        data = subprocess.check_output(['netsh', 'wlan', 'show', 'profiles'], encoding='utf-8').split('\n')
        profiles = [line.split(":")[1].strip() for line in data if "All User Profile" in line]

        print("\nWiFi Passwords (Windows):\n" + "-"*40)
        for profile in profiles:
            try:
                results = subprocess.check_output(['netsh', 'wlan', 'show', 'profile', profile, 'key=clear'], encoding='utf-8').split('\n')
                passwords = [line.split(":")[1].strip() for line in results if "Key Content" in line]
                password = passwords[0] if passwords else "No Password Found"
                print(f"{profile:<30}| {password}")

            except subprocess.CalledProcessError:
                print(f"{profile:<30}| Unable to retrieve password")

    except Exception as e:
        print("Error retrieving WiFi passwords on Windows:", str(e))


def get_wifi_interface():
    """Find the correct WiFi interface on macOS."""
    try:
        result = subprocess.check_output(["networksetup", "-listallhardwareports"], encoding='utf-8').split("\n")
        for i in range(len(result)):
            if "Wi-Fi" in result[i]:  # Find the Wi-Fi section
                return result[i + 1].split(": ")[1]  # Get the device name (e.g., en0, en1)
    except Exception as e:
        print("Error detecting WiFi interface:", str(e))
    return "en0"  # Default to en0 if detection fails


def get_wifi_passwords_mac():
    """Retrieve and print saved WiFi passwords on macOS."""
    interface = get_wifi_interface()
    
    try:
        wifi_profiles = subprocess.check_output(["/usr/sbin/networksetup", "-listpreferredwirelessnetworks", interface], encoding='utf-8').split("\n")[1:]

        print("\nWiFi Passwords (macOS):\n" + "-"*40)
        for wifi in wifi_profiles:
            wifi = wifi.strip()
            if wifi:
                try:
                    process = subprocess.run(
                        ["security", "find-generic-password", "-ga", wifi],
                        stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True
                    )
                    output = process.stderr  # The password is actually in stderr, not stdout

                    if "password:" in output:
                        password = output.split("password: ")[1].strip().strip('"')
                    else:
                        password = "No password found"

                    print(f"{wifi:<30}| {password}")

                except subprocess.CalledProcessError:
                    print(f"{wifi:<30}| No password found")

    except subprocess.CalledProcessError:
        print(f"Error: Could not retrieve networks. Is WiFi enabled on {interface}?")


if __name__ == "__main__":
    # Ensure the script runs with proper privileges
    run_as_admin()

    os_type = platform.system()
    if os_type == "Windows":
        get_wifi_password_windows()
    elif os_type == "Darwin":
        get_wifi_passwords_mac()
    else:
        print("Unsupported Operating System")
