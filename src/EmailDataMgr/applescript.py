import subprocess

def asrun(ascript):
  "Run the given AppleScript and return the standard output."

  osa = subprocess.run(['/usr/bin/osascript', '-'], input=ascript, text=True, capture_output=True)
  if osa.returncode == 0:
    return osa.stdout.rstrip()
  else:
    raise ChildProcessError(f'AppleScript: {osa.stderr.rstrip()}')

def asquote(astr):
  "Return the AppleScript equivalent of the given string."

  astr = astr.replace('"', '" & quote & "')
  return '"{}"'.format(astr)