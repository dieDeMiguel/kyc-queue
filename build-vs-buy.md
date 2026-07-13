# Build vs Buy

A comparison of buying a platform like Retool versus building internal tools with Devin and in-house developers.

## Buy is expensive, but it buys speed and maturity

Retool costs roughly **$750K over 3 years**, but delivers:

- Fast app assembly
- Connectors
- SSO
- RBAC
- Audit logs
- SOC 2
- Vendor maintenance
- Security patching

## Build is cheaper if the scope stays small

Devin + in-house build is roughly **$340K over 3 years**, saving about **$400K**, assuming the team only needs these three internal tools.

## The real build cost is production hardening

Devin proved the prototype can be built quickly, but the serious work is:

- SSO
- Postgres
- Tests
- Review
- Audit logs
- Ongoing maintenance

## Retool's advantage grows with more apps

For three apps, building is financially defensible. But if the company keeps creating a 4th, 5th, or 10th internal tool, Retool's near-zero marginal effort can flip the math.

## Risk differs by app

| App | Risk level | Notes |
| --- | --- | --- |
| KYC queue | Low | Internal workflow tool |
| Feature flags | Medium | Bugs can affect production |
| Refunds | High | Money movement requires approvals, reconciliation, idempotency, and auditability |

## Buying transfers operational accountability, not business logic risk

Retool provides:

- SLAs
- Support escalation
- Compliance artifacts
- Vendor responsibility for the platform

Your team still owns app logic, data issues, and any refund mistakes.

## Deployment and hosting

Low traffic volumes (not customer facing) mean hosting will be cheap, but the overhead of deploying apps to cloud platforms is not zero.

## Verdict: build conditionally, de-risk in stages

1. Start with the KYC queue.
2. Run it in parallel with Retool.
3. Build shared SSO/audit infrastructure.
4. Leave refunds for last—or never.
5. Use the prototype as leverage in Retool renewal negotiations.
