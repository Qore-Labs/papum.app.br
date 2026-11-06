param([string]$OutputDirectory)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime]
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesisStream, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime]

function Wait-WinRt($Operation, [Type]$ResultType) {
  $method = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetGenericArguments().Count -eq 1 -and
    $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
  } | Select-Object -First 1
  $task = $method.MakeGenericMethod($ResultType).Invoke($null, @($Operation))
  $task.Wait()
  return $task.Result
}

[System.IO.Directory]::CreateDirectory($OutputDirectory) | Out-Null
$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$synth.Voice = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices |
  Where-Object { $_.DisplayName -eq 'Microsoft Maria' -and $_.Language -eq 'pt-BR' } |
  Select-Object -First 1
if ($null -eq $synth.Voice) { throw 'Voz brasileira não disponível.' }

$segments = @(
  'Seu restaurante. Sua marca. Seu <sub alias="épi">app</sub>.',
  'A proposta da <sub alias="Pá pum delíveri">Papum Delivery</sub>: um <sub alias="épi">app</sub> com sua identidade.',
  'Seu cardápio, com a sua cara.',
  'Pedidos e contatos organizados em um painel.',
  'Menos bagunça. Mais controle.',
  'Estamos em pré-lançamento.',
  'Cadastre seu interesse no link da bio.'
)

for ($index = 0; $index -lt $segments.Count; $index++) {
  $ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="pt-BR"><prosody rate="100%">' + $segments[$index] + '</prosody></speak>'
  $stream = Wait-WinRt ($synth.SynthesizeSsmlToStreamAsync($ssml)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
  $reader = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
  $filename = Join-Path $OutputDirectory ('voice-{0:00}.wav' -f ($index + 1))
  $writer = [System.IO.File]::Open($filename, [System.IO.FileMode]::Create)
  try { $reader.CopyTo($writer) } finally { $writer.Dispose(); $reader.Dispose(); $stream.Dispose() }
  Write-Output $filename
}
$synth.Dispose()
