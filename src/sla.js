export function getSelectedSla({ itemIndex, logisticsInfo }) {
  const logisticInfo = logisticsInfo[itemIndex]
  const selectedSla = logisticInfo.selectedSla
  return logisticInfo.slas.find(sla => sla.id === selectedSla)
}
