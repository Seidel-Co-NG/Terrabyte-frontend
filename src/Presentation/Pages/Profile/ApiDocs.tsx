import { useEffect, useState } from 'react';
import { FiCopy, FiPlay, FiCode, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import { userApi } from '../../../core/api/user.api';
import { apiConfig } from '../../../core/config/api.config';

const pageClass =
  'p-6 md:p-5 lg:p-8 ml-0 lg:ml-[280px] mt-[70px] md:mt-16 min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)]';

type ParamDef = { key: string; label: string; type: 'text' | 'number' | 'select'; placeholder?: string; options?: { value: string; label: string }[] };

interface ApiEndpoint {
  id: string;
  method: string;
  path: string;
  title: string;
  description: string;
  params?: ParamDef[];
  queryParams?: ParamDef[];
  pathParam?: string;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'user-data',
    method: 'GET',
    path: '/api/user-data',
    title: 'User Data',
    description: 'Get user details and wallet balance.',
    params: [],
  },
  {
    id: 'topup',
    method: 'POST',
    path: '/api/topup',
    title: 'Buy Airtime',
    description: 'Purchase airtime. Network: 1=MTN, 2=GLO, 3=9MOBILE, 4=AIRTEL. Transaction PIN not required for API token auth.',
    params: [
      { key: 'network', label: 'Network ID', type: 'select', options: [
        { value: '1', label: 'MTN' }, { value: '2', label: 'GLO' }, { value: '3', label: '9MOBILE' }, { value: '4', label: 'AIRTEL' },
      ]},
      { key: 'mobile_number', label: 'Mobile Number', type: 'text', placeholder: '08012345678' },
      { key: 'amount', label: 'Amount', type: 'number', placeholder: '100' },
    ],
  },
  {
    id: 'data',
    method: 'POST',
    path: '/api/data',
    title: 'Buy Data',
    description: 'Purchase data bundle. Use plan ID from data plans. Transaction PIN not required for API token auth.',
    params: [
      { key: 'network', label: 'Network ID', type: 'select', options: [
        { value: '1', label: 'MTN' }, { value: '2', label: 'GLO' }, { value: '3', label: '9MOBILE' }, { value: '4', label: 'AIRTEL' },
      ]},
      { key: 'mobile_number', label: 'Mobile Number', type: 'text', placeholder: '08012345678' },
      { key: 'plan', label: 'Plan ID', type: 'text', placeholder: '1' },
    ],
  },
  {
    id: 'billpayment',
    method: 'POST',
    path: '/api/billpayment',
    title: 'Buy Electricity',
    description: 'Purchase electricity. MeterType: 1=PREPAID, 2=POSTPAID. Transaction PIN not required for API token auth.',
    params: [
      { key: 'disco_name', label: 'Disco Name', type: 'text', placeholder: 'EKEDC' },
      { key: 'meter_number', label: 'Meter Number', type: 'text', placeholder: '12345678901' },
      { key: 'amount', label: 'Amount', type: 'number', placeholder: '2000' },
      { key: 'MeterType', label: 'Meter Type', type: 'select', options: [
        { value: '1', label: 'PREPAID' }, { value: '2', label: 'POSTPAID' },
      ]},
      { key: 'customer_name', label: 'Customer Name', type: 'text', placeholder: 'John Doe' },
    ],
  },
  {
    id: 'cablesub',
    method: 'POST',
    path: '/api/cablesub',
    title: 'Buy Cable TV',
    description: 'Subscribe to cable. Cablename: 1=GOTV, 2=DSTV, 3=STARTIMES. Transaction PIN not required for API token auth.',
    params: [
      { key: 'cablename', label: 'Cable ID', type: 'select', options: [
        { value: '1', label: 'GOTV' }, { value: '2', label: 'DSTV' }, { value: '3', label: 'STARTIMES' },
      ]},
      { key: 'cableplan', label: 'Cable Plan ID', type: 'text', placeholder: '1' },
      { key: 'smart_card_number', label: 'Smart Card / IUC', type: 'text', placeholder: '12345678901' },
    ],
  },
  {
    id: 'validateiuc',
    method: 'GET',
    path: '/api/validateiuc',
    title: 'Validate IUC',
    description: 'Validate cable smart card number.',
    params: [],
    queryParams: [
      { key: 'smart_card_number', label: 'Smart Card / IUC', type: 'text', placeholder: '12345678901' },
      { key: 'cablename', label: 'Cable ID', type: 'select', options: [
        { value: '1', label: 'GOTV' }, { value: '2', label: 'DSTV' }, { value: '3', label: 'STARTIMES' },
      ]},
    ],
  },
  {
    id: 'validatemeter',
    method: 'GET',
    path: '/api/validatemeter',
    title: 'Validate Meter',
    description: 'Validate electricity meter number.',
    params: [],
    queryParams: [
      { key: 'meternumber', label: 'Meter Number', type: 'text', placeholder: '12345678901' },
      { key: 'disconame', label: 'Disco Name', type: 'text', placeholder: 'EKEDC' },
      { key: 'mtype', label: 'Meter Type', type: 'select', options: [
        { value: '1', label: 'PREPAID' }, { value: '2', label: 'POSTPAID' },
      ]},
    ],
  },
  {
    id: 'data-list',
    method: 'GET',
    path: '/api/data',
    title: 'Data Transactions',
    description: 'List all data transactions.',
    params: [],
    queryParams: [
      { key: 'limit', label: 'Limit', type: 'number', placeholder: '50' },
      { key: 'page', label: 'Page', type: 'number', placeholder: '1' },
    ],
  },
  {
    id: 'data-id',
    method: 'GET',
    path: '/api/data',
    title: 'Query Data Transaction',
    description: 'Get a specific data transaction by ID.',
    params: [],
    pathParam: 'id',
    queryParams: [],
  },
  {
    id: 'topup-id',
    method: 'GET',
    path: '/api/topup',
    title: 'Query Airtime Transaction',
    description: 'Get a specific airtime transaction by ID.',
    params: [],
    pathParam: 'id',
    queryParams: [],
  },
  {
    id: 'billpayment-id',
    method: 'GET',
    path: '/api/billpayment',
    title: 'Query Bill Payment',
    description: 'Get a specific electricity transaction by ID.',
    params: [],
    pathParam: 'id',
    queryParams: [],
  },
  {
    id: 'cablesub-id',
    method: 'GET',
    path: '/api/cablesub',
    title: 'Query Cable Subscription',
    description: 'Get a specific cable subscription by ID.',
    params: [],
    pathParam: 'id',
    queryParams: [],
  },
];

function buildSampleCode(
  baseUrl: string,
  apiKey: string,
  ep: ApiEndpoint,
  body: Record<string, string>
): Record<string, string> {
  const pathSuffix = ep.pathParam ? (body[ep.pathParam] ? `/${body[ep.pathParam]}` : '/{id}') : '';
  const url = `${baseUrl}${ep.path}${pathSuffix}`;
  const queryStr = ep.queryParams?.length
    ? '?' + ep.queryParams.map((p) => `${p.key}=${body[p.key] ?? `{${p.key}}`}`).join('&')
    : '';

  const getUrl = (u: string) => u + queryStr;

  return {
    curl: ep.method === 'GET'
      ? `curl -X GET "${getUrl(url)}" \\
  -H "Authorization: Token ${apiKey}" \\
  -H "Accept: application/json"`
      : `curl -X POST "${getUrl(url)}" \\
  -H "Authorization: Token ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '${JSON.stringify(body)}'`,
    php: ep.method === 'GET'
      ? `<?php
$ch = curl_init('${getUrl(url)}');
curl_setopt_array($ch, [
  CURLOPT_HTTPHEADER => [
    'Authorization: Token ${apiKey}',
    'Accept: application/json'
  ],
  CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);`
      : `<?php
$body = '${JSON.stringify(body).replace(/'/g, "\\'")}';
$ch = curl_init('${getUrl(url)}');
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => $body,
  CURLOPT_HTTPHEADER => [
    'Authorization: Token ${apiKey}',
    'Content-Type: application/json',
    'Accept: application/json'
  ],
  CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);`,
    python: ep.method === 'GET'
      ? `import requests

api_key = "${apiKey}"
url = "${getUrl(url)}"
headers = {"Authorization": f"Token {api_key}", "Accept": "application/json"}
response = requests.get(url, headers=headers)
data = response.json()`
      : `import requests

api_key = "${apiKey}"
url = "${getUrl(url)}"
headers = {"Authorization": f"Token {api_key}", "Content-Type": "application/json", "Accept": "application/json"}
body = ${JSON.stringify(body, null, 2)}
response = requests.post(url, json=body, headers=headers)
data = response.json()`,
    node: ep.method === 'GET'
      ? `const response = await fetch('${getUrl(url)}', {
  headers: { 'Authorization': \`Token \${apiKey}\`, 'Accept': 'application/json' }
});
const data = await response.json();`
      : `const response = await fetch('${getUrl(url)}', {
  method: 'POST',
  headers: {
    'Authorization': \`Token \${apiKey}\`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(${JSON.stringify(body)})
});
const data = await response.json();`,
  };
}

const ApiDocs = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [codeTab, setCodeTab] = useState<'curl' | 'php' | 'python' | 'node'>('curl');
  const [paramValues, setParamValues] = useState<Record<string, Record<string, string>>>({});
  const [responses, setResponses] = useState<Record<string, { status: number; body: string }>>({});
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    userApi.getApiKey()
      .then((res) => {
        if (cancelled) return;
        const key = (res?.data as { api_key?: string })?.api_key ?? null;
        setApiKey(key);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getParamValue = (epId: string, key: string) => paramValues[epId]?.[key] ?? '';

  const setParamValue = (epId: string, key: string, value: string) => {
    setParamValues((prev) => ({
      ...prev,
      [epId]: { ...(prev[epId] ?? {}), [key]: value },
    }));
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const runTest = async (ep: ApiEndpoint) => {
    if (!apiKey) {
      toast.error('No API key available');
      return;
    }
    setLoadingIds((prev) => new Set([...prev, ep.id]));
    setResponses((prev) => ({ ...prev, [ep.id]: { status: 0, body: '' } }));

    try {
      let url = `${apiConfig.baseUrl}${ep.path}`;
      const vals = paramValues[ep.id] ?? {};

      if (ep.pathParam && vals[ep.pathParam]) {
        url += `/${vals[ep.pathParam]}`;
      } else if (ep.pathParam) {
        setResponses((prev) => ({ ...prev, [ep.id]: { status: 0, body: 'Please provide ' + ep.pathParam } }));
        setLoadingIds((prev) => { const next = new Set(prev); next.delete(ep.id); return next; });
        return;
      }

      const queryParams = ep.queryParams ?? [];
      const query = new URLSearchParams();
      queryParams.forEach((p) => {
        const v = vals[p.key];
        if (v != null && v !== '') query.set(p.key, v);
      });
      const queryStr = query.toString();
      if (queryStr) url += `?${queryStr}`;

      const headers: Record<string, string> = {
        Authorization: `Token ${apiKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };

      const opts: RequestInit = { headers, method: ep.method };
      if (['POST', 'PUT', 'PATCH'].includes(ep.method)) {
            const body: Record<string, string | number> = {};
        (ep.params ?? []).forEach((p) => {
          const v = vals[p.key];
          if (v != null && v !== '') body[p.key] = p.type === 'number' ? Number(v) : v;
        });
        opts.body = JSON.stringify(body);
      }

      const res = await fetch(url, opts);
      const text = await res.text();
      let bodyStr: string;
      try {
        bodyStr = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        bodyStr = text || '(empty)';
      }

      setResponses((prev) => ({ ...prev, [ep.id]: { status: res.status, body: bodyStr } }));
    } catch (e) {
      setResponses((prev) => ({
        ...prev,
        [ep.id]: { status: 0, body: e instanceof Error ? e.message : 'Request failed' },
      }));
    } finally {
      setLoadingIds((prev) => { const next = new Set(prev); next.delete(ep.id); return next; });
    }
  };

  const baseUrl = apiConfig.baseUrl;

  return (
    <div className={pageClass}>
      <div className="max-w-5xl mx-auto">
        <BackButton fallbackTo="/dashboard/profile/api-key" />
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-4 mb-2 flex items-center gap-2">
          <FiCode className="w-8 h-8 text-[var(--accent-primary)]" />
          API Documentation
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Integration API (Token auth). Test endpoints, view sample code, and see responses.
        </p>

        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden mb-6">
          <div className="p-4 border-b border-[var(--border-color)]">
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">Your API Key</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-sm font-mono text-[var(--text-primary)] bg-[var(--bg-tertiary)] px-3 py-2 rounded-lg break-all">
                {isLoading ? 'Loading…' : apiKey ? `${apiKey.slice(0, 10)}••••••••` : '—'}
              </code>
              <button
                type="button"
                onClick={() => apiKey && handleCopy(apiKey)}
                disabled={!apiKey}
                className="shrink-0 p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-primary)] disabled:opacity-50"
                aria-label="Copy token"
              >
                <FiCopy className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Header: <code className="font-mono">Authorization: Token YOUR_API_KEY</code>
            </p>
          </div>
        </section>

        <div className="space-y-2">
          {API_ENDPOINTS.map((ep) => {
            const isOpen = expanded.has(ep.id);
            const params = ep.params ?? [];
            const queryParams = ep.queryParams ?? [];
            const allParams = [...params, ...queryParams];
            const body: Record<string, string> = {};
            allParams.forEach((p) => {
              const v = getParamValue(ep.id, p.key);
              if (v) body[p.key] = v;
            });
            if (ep.pathParam) {
              const v = getParamValue(ep.id, ep.pathParam);
              if (v) body[ep.pathParam] = v;
            }
            const samples = apiKey ? buildSampleCode(baseUrl, apiKey, ep, body) : null;
            const resp = responses[ep.id];
            const isRunning = loadingIds.has(ep.id);

            return (
              <div
                key={ep.id}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(ep.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <span className="text-[var(--text-muted)]">{isOpen ? <FiChevronDown className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}</span>
                  <span className={`font-mono text-sm px-2 py-0.5 rounded ${
                    ep.method === 'GET' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'bg-green-500/20 text-green-600'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm text-[var(--text-secondary)]">{ep.path}{ep.pathParam ? '/{id}' : ''}</span>
                  <span className="font-semibold text-[var(--text-primary)]">{ep.title}</span>
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 border-t border-[var(--border-color)] space-y-4">
                    <p className="text-sm text-[var(--text-secondary)]">{ep.description}</p>

                    {samples && (
                      <div>
                        <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Sample Code</p>
                        <div className="flex gap-2 mb-2">
                          {(['curl', 'php', 'python', 'node'] as const).map((lang) => (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => setCodeTab(lang)}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                codeTab === lang ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                              }`}
                            >
                              {lang === 'curl' ? 'cURL' : lang === 'node' ? 'Node.js' : lang === 'php' ? 'PHP' : 'Python'}
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <pre className="text-xs font-mono text-[var(--text-primary)] bg-[var(--bg-tertiary)] p-4 rounded-lg overflow-x-auto max-h-[200px] overflow-y-auto">
                            <code>{samples[codeTab]}</code>
                          </pre>
                          <button
                            type="button"
                            onClick={() => handleCopy(samples[codeTab])}
                            className="absolute top-2 right-2 p-2 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                          >
                            <FiCopy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Test</p>
                      <div className="grid gap-3 sm:grid-cols-2 mb-4">
                        {[...params, ...queryParams, ...(ep.pathParam ? [{ key: ep.pathParam, label: ep.pathParam.toUpperCase(), type: 'text' as const, placeholder: 'ID' }] : [])].map((p) => (
                          <div key={p.key}>
                            <label className="block text-xs text-[var(--text-muted)] mb-1">{p.label}</label>
                            {p.type === 'select' ? (
                              <select
                                value={getParamValue(ep.id, p.key)}
                                onChange={(e) => setParamValue(ep.id, p.key, e.target.value)}
                                className="w-full text-sm border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-3 py-2"
                              >
                                <option value="">Select</option>
                                {p.options?.map((o) => (
                                  <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={p.type}
                                value={getParamValue(ep.id, p.key)}
                                onChange={(e) => setParamValue(ep.id, p.key, e.target.value)}
                                placeholder={p.placeholder}
                                className="w-full text-sm border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-3 py-2"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => runTest(ep)}
                        disabled={isRunning || !apiKey}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
                      >
                        <FiPlay className="w-4 h-4" />
                        {isRunning ? 'Sending…' : 'Send Request'}
                      </button>
                    </div>

                    {resp && (
                      <div>
                        <p className="text-xs font-medium text-[var(--text-muted)] mb-2">
                          Response {resp.status > 0 && <span className="text-[var(--text-primary)]">({resp.status})</span>}
                        </p>
                        <pre className="text-xs font-mono text-[var(--text-primary)] bg-[var(--bg-tertiary)] p-4 rounded-lg overflow-x-auto max-h-[200px] overflow-y-auto">
                          {resp.body}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
