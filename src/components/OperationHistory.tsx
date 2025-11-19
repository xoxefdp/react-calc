type OperationHistoryProps = { history?: string[] }

function OperationHistory({ history = [] }: OperationHistoryProps) {
  if (!history || history.length === 0) return null
  return (
    // reuse the same inline history markup used inside Display so styles stay consistent
    <div className="calc-operation">
      <ul>
        {history.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </div>
  )
}

export default OperationHistory
