export function ErrorMessage({ err }: { err: Error }) {
  return <span>error:${err.message}</span>
}
