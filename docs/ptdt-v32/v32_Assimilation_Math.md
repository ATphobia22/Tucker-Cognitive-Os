# PTDT v32 Data Assimilation Mathematics (EnKF)

The PTDT data assimilation module employs an Ensemble Kalman Filter (EnKF) to continuously update the model state with real-time telemetry.

## State Vector Definition
Let $\mathbf{x}_t \in \mathbb{R}^n$ be the state vector at time $t$:
$$ \mathbf{x}_t = [ h_{2D}, \mathbf{v}_{2D}, H_{GW}, Q_{pipe}, \tau_{bed}, \Delta z_{scour}, \text{FoS} ]^T $$
Where:
- $h_{2D}$: 2D hydraulic water surface elevation (HEC-RAS)
- $\mathbf{v}_{2D}$: 2D velocity vector (HEC-RAS)
- $H_{GW}$: Groundwater head (MODFLOW)
- $Q_{pipe}$: Pipe flow (SWMM)
- $\tau_{bed}$: Bed shear stress (Sediment)
- $\Delta z_{scour}$: Scour depth (Sediment)
- $\text{FoS}$: Factor of Safety (Bishop)

## Ensemble Generation
An ensemble of $N$ model states is maintained:
$$ \mathbf{X}_t = [ \mathbf{x}_{1,t}, \mathbf{x}_{2,t}, \dots, \mathbf{x}_{N,t} ] \in \mathbb{R}^{n \times N} $$

## Forecast Step
Each ensemble member is propagated forward in time using the non-linear model operator $\mathcal{M}$:
$$ \mathbf{x}_{i,t}^f = \mathcal{M}(\mathbf{x}_{i,t-1}^a, \mathbf{u}_t) + \mathbf{q}_i $$
Where $\mathbf{u}_t$ represents boundary conditions/forcings, and $\mathbf{q}_i$ is model error.

The ensemble mean is:
$$ \bar{\mathbf{x}}_t^f = \frac{1}{N} \sum_{i=1}^N \mathbf{x}_{i,t}^f $$

The forecast error covariance matrix is approximated as:
$$ \mathbf{P}_t^f = \frac{1}{N-1} \sum_{i=1}^N (\mathbf{x}_{i,t}^f - \bar{\mathbf{x}}_t^f)(\mathbf{x}_{i,t}^f - \bar{\mathbf{x}}_t^f)^T $$

## Analysis Step
Let $\mathbf{y}_t \in \mathbb{R}^m$ be the observation vector (gauges, radar, SCADA).
The observation operator $\mathcal{H}$ maps state space to observation space. We assume linear $\mathbf{H}$ for simplicity or use a linearized Jacobian.

The Kalman Gain is computed as:
$$ \mathbf{K}_t = \mathbf{P}_t^f \mathbf{H}^T (\mathbf{H} \mathbf{P}_t^f \mathbf{H}^T + \mathbf{R})^{-1} $$
Where $\mathbf{R}$ is the observation error covariance matrix.

Each ensemble member is updated:
$$ \mathbf{x}_{i,t}^a = \mathbf{x}_{i,t}^f + \mathbf{K}_t (\mathbf{y}_{i,t} - \mathcal{H}(\mathbf{x}_{i,t}^f)) $$
Where $\mathbf{y}_{i,t} = \mathbf{y}_t + \mathbf{\epsilon}_i$ and $\mathbf{\epsilon}_i \sim \mathcal{N}(0, \mathbf{R})$.

## Localization and Inflation
To prevent spurious correlations and filter divergence:
- **Localization**: $\mathbf{P}_t^f$ is Schur-multiplied by a distance-dependent correlation matrix $\mathbf{\rho}$.
- **Inflation**: The ensemble spread is artificially increased by a factor $\alpha > 1$:
  $$ \mathbf{x}_{i,t}^f \leftarrow \bar{\mathbf{x}}_t^f + \alpha (\mathbf{x}_{i,t}^f - \bar{\mathbf{x}}_t^f) $$
