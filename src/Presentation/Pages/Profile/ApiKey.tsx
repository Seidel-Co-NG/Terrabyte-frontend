import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiKey, FiCopy, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import { userApi } from '../../../core/api/user.api';
import { servicesApi } from '../../../core/api';
import { apiConfig } from '../../../core/config/api.config';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

type DataPlanRow = { id: number | string; network: string; type: string; size: string; amount: number };
type CablePlanRow = { id: number | string; cable: string; plan: string; amount: number };

const ApiKey = () => { 
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiIpWhitelist, setApiIpWhitelist] = useState<string>('');
  const [ipWhitelistDirty, setIpWhitelistDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataPlans, setDataPlans] = useState<DataPlanRow[]>([]);
  const [cablePlans, setCablePlans] = useState<CablePlanRow[]>([]);
  const [dataPlanNetworkFilter, setDataPlanNetworkFilter] = useState<string>('');
  const [cablePlanFilter, setCablePlanFilter] = useState<string>('');
  const [isResetting, setIsResetting] = useState(false);
  const [isSavingIpWhitelist, setIsSavingIpWhitelist] = useState(false);

  const filteredDataPlans = dataPlanNetworkFilter
    ? dataPlans.filter((p) => p.network.toLowerCase() === dataPlanNetworkFilter.toLowerCase())
    : dataPlans;
  const filteredCablePlans = cablePlanFilter
    ? cablePlans.filter((p) => p.cable.toLowerCase() === cablePlanFilter.toLowerCase())
    : cablePlans;
  const dataPlanNetworks = ['', ...Array.from(new Set(dataPlans.map((p) => p.network))).filter(Boolean).sort()];
  const cablePlanProviders = ['', ...Array.from(new Set(cablePlans.map((p) => p.cable))).filter(Boolean).sort()];

  useEffect(() => {
    let cancelled = false;
    userApi
      .getApiKey()
      .then((res) => {
        if (cancelled) return;
        const data = res?.data as { api_key?: string; api_ip_whitelist?: string } | undefined;
        const key = data?.api_key ?? null;
        setApiKey(key);
        setApiIpWhitelist(data?.api_ip_whitelist ?? '');
        setError(null);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load API key');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    servicesApi.getDataPlans().then((res) => {
      if (cancelled) return;
      const data = res?.data as unknown;
      const list = Array.isArray(data) ? data : [];
      setDataPlans(
        (Array.isArray(list) ? list : []).map((p: Record<string, unknown>) => ({
          id: typeof p.id === 'number' || typeof p.id === 'string' ? p.id : String(p.id ?? ''),
          network: String(p.network ?? ''),
          type: String(p.type ?? ''),
          size: String(p.size ?? ''),
          amount: typeof p.amount === 'number' ? p.amount : parseFloat(String(p.amount ?? 0)) || 0,
        }))
      );
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    servicesApi.getCablePlans().then((res) => {
      if (cancelled) return;
      const data = res?.data as unknown;
      const list = Array.isArray(data) ? data : [];
      setCablePlans(
        (Array.isArray(list) ? list : []).map((p: Record<string, unknown>) => ({
          id: typeof p.id === 'number' || typeof p.id === 'string' ? p.id : String(p.id ?? ''),
          cable: String(p.cable ?? ''),
          plan: String(p.plan ?? ''),
          amount: typeof p.amount === 'number' ? p.amount : parseFloat(String(p.amount ?? 0)) || 0,
        }))
      );
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handleCopy = async () => {
    if (!apiKey) return;
    try {
      await navigator.clipboard.writeText(apiKey);
      toast.success('API key copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleCopyBaseUrl = async () => {
    const url = apiConfig.baseUrl;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Base URL copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleReset = async () => {
    if (isResetting) return;
    setIsResetting(true);
    try {
      const res = await userApi.resetApiKey();
      const key = (res?.data as { api_key?: string })?.api_key ?? null;
      setApiKey(key);
      toast.success('API key reset successfully. Update your integrations with the new key.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to reset API key');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSaveIpWhitelist = async () => {
    if (isSavingIpWhitelist) return;
    setIsSavingIpWhitelist(true);
    try {
      await userApi.updateApiKeyIpWhitelist(apiIpWhitelist);
      setIpWhitelistDirty(false);
      toast.success('IP whitelist saved. Only listed IPs can use your API key (empty = allow all).');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save IP whitelist');
    } finally {
      setIsSavingIpWhitelist(false);
    }
  };

  return (
    <div className={pageClass}>
      <div className="max-w-6xl mx-auto">
        <BackButton fallbackTo="/dashboard/profile" /> 
        <div className="flex flex-wrap items-center gap-3 mt-4 mb-6">
          <h1 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <FiKey className="w-6 h-6 text-[var(--accent-primary)]" />
            API Key
          </h1>
          <Link
            to="/dashboard/api-docs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--accent-primary)] text-[var(--accent-primary)] text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors no-underline"
          >
            API Documentation
          </Link>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Use your API key to authenticate requests to the API (e.g. airtime, data, electricity, cable).
        </p>

        {isLoading ? (
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 text-center">
            <p className="text-[var(--text-muted)]">Loading...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <p className="text-[var(--error)]">{error}</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)]">
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">Your API Key</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isResetting}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiRefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                  {isResetting ? 'Resetting…' : 'Reset'}
                </button>
                <code className="flex-1 text-sm font-mono text-[var(--text-primary)] bg-[var(--bg-tertiary)] px-3 py-2 rounded-lg break-all">
                  {apiKey ? `${apiKey.slice(0, 10)}••••••••••••••••••••••••` : '—'}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!apiKey}
                  className="shrink-0 p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-primary)] disabled:opacity-50"
                  aria-label="Copy API key"
                >
                  <FiCopy className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">Base URL</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-sm font-mono text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-3 py-2 rounded-lg break-all">
                  {apiConfig.baseUrl}
                </code>
                <button
                  type="button"
                  onClick={handleCopyBaseUrl}
                  className="shrink-0 p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-primary)]"
                  aria-label="Copy base URL"
                >
                  <FiCopy className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Add header: <code className="font-mono">Authorization: Token YOUR_API_KEY</code>
              </p>
            </div>
            <div className="p-4 border-t border-[var(--border-color)]">
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">IP whitelist (optional)</p>
              <p className="text-xs text-[var(--text-muted)] mb-2">
                Restrict API key usage to specific IPs. One IP per line or comma-separated. Leave empty to allow all IPs.
              </p>
              <textarea
                value={apiIpWhitelist}
                onChange={(e) => {
                  setApiIpWhitelist(e.target.value);
                  setIpWhitelistDirty(true);
                }}
                placeholder={'e.g. 192.168.1.1\n10.0.0.1'}
                rows={4}
                className="w-full text-sm font-mono text-[var(--text-primary)] bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
              {ipWhitelistDirty && (
                <button
                  type="button"
                  onClick={handleSaveIpWhitelist}
                  disabled={isSavingIpWhitelist}
                  className="mt-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingIpWhitelist ? 'Saving…' : 'Save IP whitelist'}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)]">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Network IDs</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Use in airtime, data requests</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">ID</th>
                    <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Network</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: '1', name: 'MTN' },
                    { id: '2', name: 'GLO' },
                    { id: '3', name: '9MOBILE' },
                    { id: '4', name: 'AIRTEL' },
                  ].map((row) => (
                    <tr key={row.id} className="border-b border-[var(--border-color)] last:border-0">
                      <td className="p-3 font-mono text-[var(--text-primary)]">{row.id}</td>
                      <td className="p-3 text-[var(--text-primary)]">{row.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)]">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Cable IDs</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Use in cable requests (cablename)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">ID</th>
                    <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Provider</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: '1', name: 'GOTV' },
                    { id: '2', name: 'DSTV' },
                    { id: '3', name: 'STARTIMES' },
                  ].map((row) => (
                    <tr key={row.id} className="border-b border-[var(--border-color)] last:border-0">
                      <td className="p-3 font-mono text-[var(--text-primary)]">{row.id}</td>
                      <td className="p-3 text-[var(--text-primary)]">{row.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Data Plans</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Use plan ID in data requests</p>
                </div>
                <select
                  value={dataPlanNetworkFilter}
                  onChange={(e) => setDataPlanNetworkFilter(e.target.value)}
                  className="text-sm border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-3 py-2 min-w-[140px]"
                >
                  <option value="">All networks</option>
                  {dataPlanNetworks.filter(Boolean).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[var(--bg-card)] z-10">
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">ID</th>
                    <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Network</th>
                    <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Type</th>
                    <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Size</th>
                    <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDataPlans.map((row) => (
                    <tr key={`${row.id}-${row.network}-${row.size}`} className="border-b border-[var(--border-color)] last:border-0">
                      <td className="p-3 font-mono text-[var(--text-primary)]">{row.id}</td>
                      <td className="p-3 text-[var(--text-primary)]">{row.network}</td>
                      <td className="p-3 text-[var(--text-secondary)]">{row.type}</td>
                      <td className="p-3 text-[var(--text-primary)]">{row.size}</td>
                      <td className="p-3 text-[var(--text-primary)]">₦{row.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  {filteredDataPlans.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-[var(--text-muted)] text-sm">No plans loaded</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Cable Plans</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Use plan ID in cable requests</p>
                </div>
                <select
                  value={cablePlanFilter}
                  onChange={(e) => setCablePlanFilter(e.target.value)}
                  className="text-sm border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-3 py-2 min-w-[140px]"
                >
                  <option value="">All providers</option>
                  {cablePlanProviders.filter(Boolean).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[var(--bg-card)] z-10">
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">ID</th>
                    <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Cable</th>
                    <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Plan</th>
                    <th className="text-left p-3 font-semibold text-[var(--text-secondary)]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCablePlans.map((row) => (
                    <tr key={`${row.id}-${row.cable}-${row.plan}`} className="border-b border-[var(--border-color)] last:border-0">
                      <td className="p-3 font-mono text-[var(--text-primary)]">{row.id}</td>
                      <td className="p-3 text-[var(--text-primary)]">{row.cable}</td>
                      <td className="p-3 text-[var(--text-primary)]">{row.plan}</td>
                      <td className="p-3 text-[var(--text-primary)]">₦{row.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  {filteredCablePlans.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-[var(--text-muted)] text-sm">No plans loaded</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKey;
