export const DATA_SOURCES = {SECURITY_DOMAIN: 'securityDomain', WIKIDATA: 'wikiData', CVE_DOMAIN: 'cveDomain'};
export const dataSources = [
    {label: 't_securityDomain', value: DATA_SOURCES.SECURITY_DOMAIN, icon: 'app-eye'},
    {label: 't_wikimedia', value: DATA_SOURCES.WIKIDATA, icon: 'wikimedia-logo'},
    {label: 't_cveDomain', value: DATA_SOURCES.CVE_DOMAIN, icon: 'app-icon-error'}
];

export const mappedDataSources = {
    [DATA_SOURCES.SECURITY_DOMAIN]: {label: 't_securityDomain', value: DATA_SOURCES.SECURITY_DOMAIN, icon: 'app-eye'},
    [DATA_SOURCES.WIKIDATA]: {label: 't_wikimedia', value: DATA_SOURCES.WIKIDATA, icon: 'wikimedia-logo'},
    [DATA_SOURCES.CVE_DOMAIN]: {label: 't_cveDomain', value: DATA_SOURCES.CVE_DOMAIN, icon: 'app-icon-error'},
}